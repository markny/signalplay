import type { PropsWithChildren } from "react";
import { NavLink } from "./NavLink";

type LayoutProps = PropsWithChildren<{
	currentPath: string;
}>;

const navItems = [
	{ href: "/", label: "Home" },
	{ href: "/projects", label: "Projects" },
	{ href: "/team", label: "Team" },
	{ href: "/simulator", label: "4th Down Simulator" },
];

export function Layout({ children, currentPath }: LayoutProps) {
	return (
		<div className="site-shell">
			<header className="site-header">
				<div className="container site-header__inner">
					<NavLink href="/" className="brand-mark">
						<span className="brand-mark__signal" />
						<span>
							<strong>SignalPlay</strong>
							<small>AI and analytics studio</small>
						</span>
					</NavLink>
					<nav className="site-nav" aria-label="Primary">
						{navItems.map((item) => (
							<NavLink
								key={item.href}
								href={item.href}
								className={currentPath === item.href ? "is-active" : undefined}
							>
								{item.label}
							</NavLink>
						))}
					</nav>
				</div>
			</header>
			<main>{children}</main>
			<footer className="site-footer">
				<div className="container site-footer__inner">
					<div>
						<p className="site-footer__brand">SignalPlay</p>
						<p className="site-footer__copy">
							Experimental tools for sports analytics, behavioral decision-making,
							and AI-native products.
						</p>
					</div>
					<div className="site-footer__links">
						<NavLink href="/projects">Projects</NavLink>
						<NavLink href="/team">Team</NavLink>
						<NavLink href="/simulator">Simulator</NavLink>
					</div>
				</div>
			</footer>
		</div>
	);
}
