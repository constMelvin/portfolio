import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AskAnything from "./ask-anything";
import AchievementsModal from "./achievements-modal";
import CommandPalette from "./command-palette";
import CommunityChat from "./community-chat";
import EmailCard from "./email-card";
import Modal from "./modal";
import Tour from "./tour";
import TypingTest from "./typing-test";
import { OverlayContext, store, type Overlay } from "@/lib/overlays";
import { playClick } from "@/lib/sound";

// Owns which overlay is open, the global shortcuts, and the first-visit tour
const OverlaysProvider = ({ children }: { children: React.ReactNode }) => {
	const [open, setOpenState] = useState<Overlay>(null);
	const [touring, setTouring] = useState(false);
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const setOpen = useCallback((overlay: Overlay) => {
		setOpenState(overlay);
		if (overlay) playClick(1.2);
	}, []);

	const startTour = useCallback(() => {
		setOpenState(null);
		navigate("/");
		window.scrollTo({ top: 0 });
		setTimeout(() => setTouring(true), 400);
	}, [navigate]);

	const endTour = () => {
		setTouring(false);
		store.set("tour-done", "1");
	};

	// Shortcuts: ⌘/Ctrl+K ask anything, ⌘/Ctrl+J typing test, "/" command palette
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const mod = e.metaKey || e.ctrlKey;
			const key = e.key.toLowerCase();
			if (mod && (key === "k" || key === "j")) {
				e.preventDefault();
				const target = key === "k" ? "ask" : "typing";
				setOpen(open === target ? null : target);
				return;
			}
			const typing = (e.target as HTMLElement).closest("input, textarea, [contenteditable]");
			if (e.key === "/" && !open && !typing) {
				e.preventDefault();
				setOpen("command");
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, setOpen]);

	// Soft click sound on every button/link when UI sounds are on
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if ((e.target as HTMLElement).closest("button, a")) playClick();
		};
		document.addEventListener("click", onClick);
		return () => document.removeEventListener("click", onClick);
	}, []);

	// Run the tour once, on a visitor's first visit to the home page
	useEffect(() => {
		if (store.get("tour-done") || pathname !== "/") return;
		const id = setTimeout(() => setTouring(true), 1400);
		return () => clearTimeout(id);
	}, [pathname]);

	return (
		<OverlayContext.Provider value={{ open, setOpen, startTour }}>
			{children}
			<AskAnything />
			<CommandPalette />
			<TypingTest />
			<CommunityChat />
			<AchievementsModal />
			<Modal open={open === "email"} onClose={() => setOpen(null)} label="Email" className="max-w-sm">
				<EmailCard onClose={() => setOpen(null)} />
			</Modal>
			<Tour running={touring} onDone={endTour} />
		</OverlayContext.Provider>
	);
};

export default OverlaysProvider;
