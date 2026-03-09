export type SimulatorInput = {
	yardLine: number;
	yardsToGo: number;
	quarter: number;
	timeRemaining: string;
	scoreDifferential: number;
};

export const defaultSimulatorInput: SimulatorInput = {
	yardLine: 58,
	yardsToGo: 4,
	quarter: 4,
	timeRemaining: "08:42",
	scoreDifferential: -3,
};

type DecisionOption = {
	expectedValue: number;
};

type GoForItOption = DecisionOption & {
	conversionRate: number;
};

type FieldGoalOption = DecisionOption & {
	distance: number;
	isAvailable: boolean;
	successRate: number;
};

export type SimulatorSummary = {
	context: SimulatorInput;
	recommendation: "Go for It" | "Punt" | "Field Goal";
	explanation: string;
	bestExpectedValue: number;
	goForIt: GoForItOption;
	punt: DecisionOption;
	fieldGoal: FieldGoalOption;
};

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

function parseClock(timeRemaining: string) {
	const match = /^(\d{1,2}):(\d{2})$/.exec(timeRemaining.trim());

	if (!match) {
		return 15 * 60;
	}

	const minutes = Number(match[1]);
	const seconds = Number(match[2]);

	return clamp(minutes * 60 + seconds, 0, 15 * 60);
}

function expectedPointsAt(fieldPosition: number) {
	return clamp(-1.35 + fieldPosition * 0.055, -1.4, 4.8);
}

function defensiveCostAt(fieldPosition: number) {
	return -expectedPointsAt(100 - fieldPosition);
}

function getConversionRate(input: SimulatorInput) {
	const base = 0.74 - (input.yardsToGo - 1) * 0.085;
	const fieldBoost = input.yardLine >= 55 ? 0.03 : 0;
	const lateBoost =
		input.quarter === 4 && parseClock(input.timeRemaining) <= 300 ? 0.03 : 0;
	const trailingBoost = input.scoreDifferential < 0 ? 0.02 : 0;

	return clamp(base + fieldBoost + lateBoost + trailingBoost, 0.12, 0.82);
}

function getFieldGoalSuccessRate(distance: number) {
	if (distance > 62) {
		return 0;
	}

	const raw = 0.97 - (distance - 20) * 0.014;
	return clamp(raw, 0.18, 0.97);
}

function getPuntNetDistance(yardLine: number) {
	if (yardLine >= 65) {
		return 28;
	}

	if (yardLine >= 50) {
		return 34;
	}

	return 39;
}

function normalizeInput(input: SimulatorInput): SimulatorInput {
	return {
		yardLine: clamp(Math.round(input.yardLine || 1), 1, 99),
		yardsToGo: clamp(Math.round(input.yardsToGo || 1), 1, 25),
		quarter: clamp(Math.round(input.quarter || 1), 1, 4),
		timeRemaining: input.timeRemaining,
		scoreDifferential: clamp(Math.round(input.scoreDifferential || 0), -30, 30),
	};
}

export function evaluateFourthDownDecision(
	rawInput: SimulatorInput,
): SimulatorSummary {
	const input = normalizeInput(rawInput);
	const conversionRate = getConversionRate(input);
	const driveValueIfConverted = expectedPointsAt(
		clamp(input.yardLine + input.yardsToGo + 7, 1, 99),
	);
	const turnoverCost = defensiveCostAt(input.yardLine);
	const goExpectedValue =
		conversionRate * driveValueIfConverted +
		(1 - conversionRate) * turnoverCost;

	const puntNetDistance = getPuntNetDistance(input.yardLine);
	const opponentStart = clamp(100 - (input.yardLine + puntNetDistance), 8, 20);
	const puntExpectedValue = -expectedPointsAt(100 - opponentStart);

	const fieldGoalDistance = 117 - input.yardLine;
	const fieldGoalSuccessRate = getFieldGoalSuccessRate(fieldGoalDistance);
	const fieldGoalAvailable = fieldGoalDistance <= 62;
	const missStart = Math.max(20, 100 - input.yardLine);
	const missValue = -expectedPointsAt(100 - missStart);
	const fieldGoalExpectedValue = fieldGoalAvailable
		? fieldGoalSuccessRate * 3 + (1 - fieldGoalSuccessRate) * missValue
		: Number.NEGATIVE_INFINITY;

	const options = [
		{ label: "Go for It" as const, expectedValue: goExpectedValue },
		{ label: "Punt" as const, expectedValue: puntExpectedValue },
		{
			label: "Field Goal" as const,
			expectedValue: fieldGoalExpectedValue,
		},
	];

	const bestOption = options.reduce((best, option) =>
		option.expectedValue > best.expectedValue ? option : best,
	);

	const scorePressure =
		input.quarter === 4 && parseClock(input.timeRemaining) < 420
			? "Late-game leverage increases the value of keeping the ball."
			: "Baseline game state favors preserving expected points."
	const fieldPositionNote =
		input.yardLine >= 55
			? "You are already in opponent territory, so surrendering possession is costly."
			: "Field position still matters, but the tradeoff is less aggressive here.";

	return {
		context: input,
		recommendation: bestOption.label,
		explanation: `${fieldPositionNote} ${scorePressure}`,
		bestExpectedValue: bestOption.expectedValue,
		goForIt: {
			expectedValue: goExpectedValue,
			conversionRate,
		},
		punt: {
			expectedValue: puntExpectedValue,
		},
		fieldGoal: {
			expectedValue: fieldGoalExpectedValue,
			distance: fieldGoalDistance,
			isAvailable: fieldGoalAvailable,
			successRate: fieldGoalSuccessRate,
		},
	};
}

export function formatFieldPosition(yardLine: number) {
	if (yardLine === 50) {
		return "Midfield";
	}

	if (yardLine < 50) {
		return `Own ${yardLine}`;
	}

	return `Opp ${100 - yardLine}`;
}

export function formatScoreDifferential(scoreDifferential: number) {
	if (scoreDifferential > 0) {
		return `Leading by ${scoreDifferential}`;
	}

	if (scoreDifferential < 0) {
		return `Trailing by ${Math.abs(scoreDifferential)}`;
	}

	return "Tied game";
}
