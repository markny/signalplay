import { NavLink } from "../components/NavLink";

export function NotFoundPage() {
	return (
		<section className="section page-intro">
			<div className="container not-found">
				<p className="eyebrow">Page not found</p>
				<h1>This route is not part of the current SignalPlay site.</h1>
				<NavLink href="/" className="button button--primary">
					Return home
				</NavLink>
			</div>
		</section>
	);
}
