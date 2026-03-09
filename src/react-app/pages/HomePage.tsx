import { ProjectCard } from "../components/ProjectCard";
import { NavLink } from "../components/NavLink";
import { featuredProjects } from "../data/projects";

export function HomePage() {
	return (
		<>
			<section className="hero">
				<div className="container hero__inner">
					<div className="hero__content">
						<p className="eyebrow">SignalPlay</p>
						<h1>Applied experiments for smarter decisions.</h1>
						<p className="hero__lede">
							SignalPlay is a small AI and analytics studio building practical,
							interactive tools at the intersection of sports economics,
							behavioral decision-making, analytics, and AI-native product
							experiments.
						</p>
						<div className="hero__actions">
							<NavLink href="/projects" className="button button--primary">
								Explore projects
							</NavLink>
							<NavLink href="/simulator" className="button button--secondary">
								Open the simulator
							</NavLink>
						</div>
					</div>
					<div className="hero-panel">
						<div className="metric-card">
							<span>Focus Areas</span>
							<strong>Sports analytics, behavioral economics, and AI</strong>
						</div>
						<div className="metric-card">
							<span>Operating Style</span>
							<strong>Small-team, research-informed, product-minded</strong>
						</div>
						<div className="metric-card">
							<span>Current Build</span>
							<strong>SignalPlay site v1 with interactive prototypes</strong>
						</div>
					</div>
				</div>
			</section>

			<section className="section">
				<div className="container">
					<div className="section-heading">
						<p className="eyebrow">Mission</p>
						<h2>A studio for turning abstract ideas into usable tools.</h2>
						<p>
							The goal is not to publish static commentary. SignalPlay builds
							demonstrations and lightweight products that make strategic
							questions visible, testable, and easier to discuss.
						</p>
					</div>
				</div>
			</section>

			<section className="section section--muted">
				<div className="container">
					<div className="section-heading">
						<p className="eyebrow">Featured Projects</p>
						<h2>Early prototypes with room to grow.</h2>
					</div>
					<div className="grid grid--projects">
						{featuredProjects.map((project) => (
							<ProjectCard key={project.title} {...project} />
						))}
					</div>
				</div>
			</section>

			<section className="section">
				<div className="container two-column">
					<div>
						<p className="eyebrow">Why This Exists</p>
						<h2>Complex ideas land better when people can interact with them.</h2>
					</div>
					<p className="supporting-copy">
						SignalPlay exists to explore practical, interactive tools that make
						concepts in economics, strategy, and behavior more tangible. The
						studio is designed as a credible home for experiments that can evolve
						into richer products, research collaborations, or public-facing demos.
					</p>
				</div>
			</section>
		</>
	);
}
