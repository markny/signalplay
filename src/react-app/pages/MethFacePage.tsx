export function MethFacePage() {
	return (
		<section className="section page-intro">
			<div className="container project-detail">
				<div className="section-heading">
					<p className="eyebrow">In Development</p>
					<h1>Meth Face (Prototype)</h1>
					<p>
						An exploratory AI-assisted image transformation concept designed to
						simulate the long-term visual effects of methamphetamine abuse.
					</p>
				</div>

				<div className="project-detail__grid">
					<div className="project-detail__card">
						<h2>Project framing</h2>
						<p>
							This concept is being explored as a behavioral messaging tool rather
							than a finished consumer product. The idea is to test whether a
							personalized visual simulation can make long-term health risk more
							immediate and easier to understand.
						</p>
					</div>
					<div className="project-detail__card">
						<h2>Status</h2>
						<p>
							The project is currently in concept and prototype planning. The
							current page is a placeholder while the framing, UX, and safety
							considerations are defined.
						</p>
					</div>
				</div>

				<div className="project-detail__card">
					<h2>Planned Features</h2>
					<ul className="feature-list">
						<li>Photo upload</li>
						<li>Intensity settings</li>
						<li>Generated transformation preview</li>
						<li>Educational and messaging overlay</li>
					</ul>
				</div>
			</div>
		</section>
	);
}
