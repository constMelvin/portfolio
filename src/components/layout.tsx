import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./footer";
import { MobileNav, Sidebar } from "./nav";

// Scroll to top on page change, or to the #section when the URL has a hash
const ScrollManager = () => {
	const { pathname, hash } = useLocation();

	useEffect(() => {
		if (!hash) {
			window.scrollTo({ top: 0 });
			return;
		}
		// Wait a frame so the target section has rendered
		const id = requestAnimationFrame(() =>
			document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" })
		);
		return () => cancelAnimationFrame(id);
	}, [pathname, hash]);

	return null;
};

// Shared shell: halftone backdrop, sidebar / mobile bar, page content and footer
const Layout = () => (
	<div className="relative min-h-screen">
		<div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
			<div className="halftone halftone-wide mask-tr absolute top-0 right-0 h-[70vh] w-[65vw] opacity-[0.16]" />
			<div className="halftone mask-bl absolute bottom-0 left-0 h-[60vh] w-[55vw] opacity-[0.13]" />
		</div>

		<ScrollManager />
		<Sidebar />
		<MobileNav />

		<main id="top" className="relative z-10 lg:pl-56">
			<Outlet />
			<Footer />
		</main>
	</div>
);

export default Layout;
