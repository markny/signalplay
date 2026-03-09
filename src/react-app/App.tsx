import { useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { MethFacePage } from "./pages/MethFacePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SimulatorPage } from "./pages/SimulatorPage";
import { TeamPage } from "./pages/TeamPage";

const routes = {
	"/": HomePage,
	"/projects": ProjectsPage,
	"/projects/meth-face": MethFacePage,
	"/simulator": SimulatorPage,
	"/team": TeamPage,
} as const;

function getCurrentPath() {
	const path = window.location.pathname.replace(/\/+$/, "") || "/";
	return path;
}

function App() {
	const [path, setPath] = useState(getCurrentPath);

	useEffect(() => {
		const handleNavigation = () => setPath(getCurrentPath());

		window.addEventListener("popstate", handleNavigation);
		window.addEventListener("signalplay:navigate", handleNavigation);

		return () => {
			window.removeEventListener("popstate", handleNavigation);
			window.removeEventListener("signalplay:navigate", handleNavigation);
		};
	}, []);

	const Page = routes[path as keyof typeof routes] ?? NotFoundPage;

	return (
		<Layout currentPath={path}>
			<Page />
		</Layout>
	);
}

export default App;
