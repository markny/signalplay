export function TeamPage() {
	return (
		<section className="section page-intro">
			<div className="container">
				<div className="section-heading">
					<p className="eyebrow">Team</p>
					<h1>Small team, interdisciplinary orientation.</h1>
					<p>
						SignalPlay combines economics, product thinking, and practical
						experimentation to turn ideas into credible prototypes.
					</p>
				</div>
				<div className="grid grid--team">
					<article className="person-card">
						<h2>Mark Wilson</h2>
						<p className="person-card__role">Co-Founder</p>
						<p>
							Professor of Economics with interests in sports economics and
							analytics.
						</p>
					</article>
					<article className="person-card">
						<h2>Christian Swaim</h2>
						<p className="person-card__role">Product Lead</p>
						<p>
							Focused on product design, branding, experimentation, and helping
							shape early-stage AI-native projects.
						</p>
					</article>
				</div>
				<div className="note-card">
					<p className="eyebrow">Collaboration</p>
					<p>
						SignalPlay also works with economists and analytics researchers as
						specific projects take shape.
					</p>
				</div>
			</div>
		</section>
	);
}
