import denseSurface from '../data/cfb4th-dense-surface.json'

export type SimulatorInput = {
  yardLine: number
  yardsToGo: number
  quarter: number
  timeRemaining: string
  scoreDifferential: number
}

export const defaultSimulatorInput: SimulatorInput = {
  yardLine: 58,
  yardsToGo: 4,
  quarter: 4,
  timeRemaining: '08:42',
  scoreDifferential: -3,
}

type DecisionOption = {
  expectedValue: number
  winProbability?: number
}

type GoForItOption = DecisionOption & {
  conversionRate: number
}

type FieldGoalOption = DecisionOption & {
  distance: number
  isAvailable: boolean
  successRate: number
}

export type SimulatorSummary = {
  context: SimulatorInput
  recommendation: 'Go for It' | 'Punt' | 'Field Goal'
  explanation: string
  bestExpectedValue: number
  bestWinProbability: number
  goForIt: GoForItOption
  punt: DecisionOption
  fieldGoal: FieldGoalOption
}

type SurfaceScenario = {
  input: SimulatorInput
  output: {
    recommendation: 'Go for It' | 'Punt' | 'Field Goal'
    goWinProb: number
    puntWinProb: number
    fgWinProb: number
    firstDownProb: number
    fgMakeProb: number
  }
}

const scenarios: SurfaceScenario[] = (denseSurface as { scenarios: SurfaceScenario[] }).scenarios

const scoreMap = new Map<string, SurfaceScenario>()
for (const scenario of scenarios) {
  scoreMap.set(makeKey(scenario.input), scenario)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function parseClockToSeconds(timeRemaining: string) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(timeRemaining.trim())
  if (!match) return 15 * 60
  return clamp(Number(match[1]) * 60 + Number(match[2]), 0, 15 * 60)
}

function formatSecondsAsClock(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${minutes}:${String(sec).padStart(2, '0')}`
}

function nearestFromList(values: number[], target: number) {
  return values.reduce((best, value) =>
    Math.abs(value - target) < Math.abs(best - target) ? value : best
  )
}

function normalizeInput(input: SimulatorInput): SimulatorInput {
  const yardLine = nearestFromList(
    Array.from({ length: 36 }, (_, index) => 20 + index * 2),
    clamp(Math.round(input.yardLine || 20), 20, 90)
  )
  const yardsToGo = nearestFromList([1, 2, 3, 4, 5, 7, 10], clamp(Math.round(input.yardsToGo || 1), 1, 10))
  const quarter = input.quarter >= 3 ? 4 : 2
  const timeSeconds = parseClockToSeconds(input.timeRemaining)
  const snappedTime = nearestFromList([720, 480, 300, 180, 90, 45], timeSeconds)
  const scoreDifferential = nearestFromList([-14, -10, -7, -3, 0, 3, 7], clamp(Math.round(input.scoreDifferential || 0), -14, 7))

  return {
    yardLine,
    yardsToGo,
    quarter,
    timeRemaining: formatSecondsAsClock(snappedTime),
    scoreDifferential,
  }
}

function makeKey(input: SimulatorInput) {
  return [input.yardLine, input.yardsToGo, input.quarter, input.timeRemaining, input.scoreDifferential].join('|')
}

function getScenario(input: SimulatorInput) {
  const normalized = normalizeInput(input)
  const exact = scoreMap.get(makeKey(normalized))
  if (exact) return { normalized, scenario: exact }

  const closest = scenarios.reduce((best, scenario) => {
    const candidate = scenario.input
    const score =
      Math.abs(candidate.yardLine - normalized.yardLine) * 1.5 +
      Math.abs(candidate.yardsToGo - normalized.yardsToGo) * 4 +
      Math.abs(candidate.quarter - normalized.quarter) * 8 +
      Math.abs(parseClockToSeconds(candidate.timeRemaining) - parseClockToSeconds(normalized.timeRemaining)) / 30 +
      Math.abs(candidate.scoreDifferential - normalized.scoreDifferential) * 3

    if (!best || score < best.score) return { score, scenario }
    return best
  }, null as null | { score: number; scenario: SurfaceScenario })

  return { normalized, scenario: closest!.scenario }
}

function buildExplanation(summary: SurfaceScenario['output'], context: SimulatorInput) {
  const urgency = context.scoreDifferential < 0 ? 'The game state slightly favors keeping the ball.' : 'Field position and expected leverage drive the call here.'
  return `${urgency} The recommendation is anchored to the dense cfb4th benchmark surface for this game state, with ${Math.round(summary.firstDownProb * 100)}% conversion odds and ${Math.round(summary.fgMakeProb * 100)}% field-goal odds.`
}

export function evaluateFourthDownDecision(rawInput: SimulatorInput): SimulatorSummary {
  const { normalized, scenario } = getScenario(rawInput)
  const out = scenario.output
  const fieldGoalDistance = 117 - normalized.yardLine

  return {
    context: normalized,
    recommendation: out.recommendation,
    explanation: buildExplanation(out, normalized),
    bestExpectedValue: Math.max(out.goWinProb, out.puntWinProb, out.fgWinProb) * 100,
    bestWinProbability: Math.max(out.goWinProb, out.puntWinProb, out.fgWinProb),
    goForIt: {
      expectedValue: out.goWinProb * 100,
      winProbability: out.goWinProb,
      conversionRate: out.firstDownProb,
    },
    punt: {
      expectedValue: out.puntWinProb * 100,
      winProbability: out.puntWinProb,
    },
    fieldGoal: {
      expectedValue: out.fgWinProb * 100,
      winProbability: out.fgWinProb,
      distance: fieldGoalDistance,
      isAvailable: true,
      successRate: out.fgMakeProb,
    },
  }
}

export function formatFieldPosition(yardLine: number) {
  if (yardLine === 50) return 'Midfield'
  if (yardLine < 50) return `Own ${yardLine}`
  return `Opp ${100 - yardLine}`
}

export function formatScoreDifferential(scoreDifferential: number) {
  if (scoreDifferential > 0) return `Leading by ${scoreDifferential}`
  if (scoreDifferential < 0) return `Trailing by ${Math.abs(scoreDifferential)}`
  return 'Tied game'
}
