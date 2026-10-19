import { store } from "./overlays";

// Tiny synthesized UI sounds (no audio files). Off by default; the sidebar toggle enables them.
let ctx: AudioContext | null = null;
let enabled = store.get("ui-sounds") === "on";
const listeners = new Set<(on: boolean) => void>();

export const soundsEnabled = () => enabled;

export const setSoundsEnabled = (on: boolean) => {
	enabled = on;
	store.set("ui-sounds", on ? "on" : "off");
	listeners.forEach((fn) => fn(on));
	if (on) playClick();
};

export const onSoundsChange = (fn: (on: boolean) => void) => {
	listeners.add(fn);
	return () => {
		listeners.delete(fn);
	};
};

export const playClick = (pitch = 1) => {
	if (!enabled) return;
	try {
		ctx ??= new AudioContext();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "triangle";
		osc.frequency.value = 880 * pitch;
		gain.gain.setValueAtTime(0.04, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
		osc.connect(gain).connect(ctx.destination);
		osc.start();
		osc.stop(ctx.currentTime + 0.07);
	} catch {
		// Web Audio unavailable
	}
};
