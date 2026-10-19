import { Route, Routes } from "react-router-dom";
import "./index.css";
import Home from "./components/home";
import Layout from "./components/layout";
import OverlaysProvider from "./components/overlays-provider";
import {
	AffiliationsPage,
	BlogPage,
	CertificationsPage,
	EducationPage,
	ExperiencePage,
	NotFoundPage,
	ProjectsPage,
	RecommendationsPage,
	StackPage,
} from "./components/pages";

function App() {
	return (
		<OverlaysProvider>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route path="/blog" element={<BlogPage />} />
					<Route path="/projects" element={<ProjectsPage />} />
					<Route path="/experience" element={<ExperiencePage />} />
					<Route path="/education" element={<EducationPage />} />
					<Route path="/stack" element={<StackPage />} />
					<Route path="/certifications" element={<CertificationsPage />} />
					<Route path="/recommendations" element={<RecommendationsPage />} />
					<Route path="/affiliations" element={<AffiliationsPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Route>
			</Routes>
		</OverlaysProvider>
	);
}

export default App;
