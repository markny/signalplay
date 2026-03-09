import { NavLink } from "./NavLink";

type ProjectCardProps = {
	title: string;
	description: string;
	href?: string;
	status: string;
};

export function ProjectCard({
	title,
	description,
	href,
	status,
}: ProjectCardProps) {
	return (
		<article className="project-card">
			<p className="eyebrow">{status}</p>
			<h3>{title}</h3>
			<p>{description}</p>
			{href ? (
				<NavLink href={href} className="inline-link">
					View project
				</NavLink>
			) : null}
		</article>
	);
}
