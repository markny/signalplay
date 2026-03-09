import type { AnchorHTMLAttributes, MouseEvent, PropsWithChildren } from "react";

type NavLinkProps = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>;

export function NavLink({ children, href = "/", onClick, ...props }: NavLinkProps) {
	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		onClick?.(event);

		if (
			event.defaultPrevented ||
			!href.startsWith("/") ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey
		) {
			return;
		}

		event.preventDefault();

		if (window.location.pathname !== href) {
			window.history.pushState({}, "", href);
			window.dispatchEvent(new Event("signalplay:navigate"));
		}

		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<a href={href} onClick={handleClick} {...props}>
			{children}
		</a>
	);
}
