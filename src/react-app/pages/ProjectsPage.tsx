import { ProjectCard } from "../components/ProjectCard";
import { featuredProjects } from "../data/projects";

export function ProjectsPage() {
	return (
		<section className="section page-intro">
			<div className="container">
				<div className="section-heading">
					<p className="eyebrow">Projects</p>
					<h1>SignalPlay prototypes and in-progress ideas.</h1>
					<p>
						Each project is meant to make a strategic or behavioral idea concrete
						enough to explore, critique, and improve.
					</p>
				</div>
				<div className="grid grid--projects">
					{featuredProjects.map((project) => (
						<ProjectCard key={project.title} {...project} />
					))}
				</div>
			</div>
		</section>
	);
}
