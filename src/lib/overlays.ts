import { createContext, useContext } from "react";

export type Overlay =
	| "ask"
	| "command"
	| "typing"
	| "email"
	| "chat"
	| "achievements"
	| null;

export const OverlayContext = createContext<{
	open: Overlay;
	setOpen: (overlay: Overlay) => void;
	startTour: () => void;
}>({ open: null, setOpen: () => {}, startTour: () => {} });

export const useOverlay = () => useContext(OverlayContext);

export const isMac =
	typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export const modKey = isMac ? "⌘" : "Ctrl";

// Safe localStorage access — storage can be unavailable (private mode, blocked cookies)
export const store = {
	get(key: string) {
		try {
			return localStorage.getItem(key);
		} catch {
			return null;
		}
	},
	set(key: string, value: string) {
		try {
			localStorage.setItem(key, value);
		} catch {
			// ignore — the value just won't persist
		}
	},
};
