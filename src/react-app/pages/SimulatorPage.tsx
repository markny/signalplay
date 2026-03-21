export function SimulatorPage() {
	return (
		<section className="section page-intro">
			<div className="container simulator-layout simulator-layout--embed">
				<div className="section-heading simulator-heading">
					<p className="eyebrow">4th Down Simulator</p>
					<h1>Test the decision, not the convention.</h1>
					<p>
						This page now embeds the current testing-focused simulator build with the same
						controls, output structure, and model behavior used in the latest cross-site pass.
					</p>
					<div className="hero__actions">
						<a className="button button--primary" href="/fourth-down-simulator/">
							Open standalone version
						</a>
					</div>
				</div>

				<div className="simulator-embed-card">
					<iframe
						title="Fourth Down Simulator"
						src="/fourth-down-simulator/"
						className="simulator-embed"
					/>
				</div>
			</div>
		</section>
	);
}
