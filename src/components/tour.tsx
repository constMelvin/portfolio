import { useEffect, useLayoutEffect, useState } from "react";
import { modKey } from "@/lib/overlays";

// Each step spotlights the element with the matching data-guide attribute
const steps = [
	{ guide: "name", title: "hi, I'm JM", text: "Welcome to my portfolio — here's a quick 20-second tour." },
	{ guide: "socials", title: "find me online", text: "My GitHub, LinkedIn and Instagram live here." },
	{ guide: "stats", title: "at a glance", text: "Click any stat to jump to the details." },
	{ guide: "sidebar", title: "jump around", text: "Use the sidebar to go straight to any section." },
	{ guide: "ask", title: "ask me anything", text: `Press ${modKey} + K to ask about my work, or ${modKey} + J for a typing test.` },
	{ guide: "email", title: "say hello", text: "Open to internships and collabs — my inbox is always open." },
];

type Rect = { top: number; left: number; width: number; height: number };

const visibleSteps = () =>
	steps.filter((s) => {
		const el = document.querySelector<HTMLElement>(`[data-guide="${s.guide}"]`);
		return el && el.getBoundingClientRect().width > 0;
	});

const Tour = ({ running, onDone }: { running: boolean; onDone: () => void }) =>
	running ? <TourSteps onDone={onDone} /> : null;

const TourSteps = ({ onDone }: { onDone: () => void }) => {
	const [list] = useState(visibleSteps);
	const [step, setStep] = useState(0);
	const [rect, setRect] = useState<Rect | null>(null);

	const current = list[step];

	useLayoutEffect(() => {
		if (!current) return;
		const el = document.querySelector<HTMLElement>(`[data-guide="${current.guide}"]`);
		if (!el) return;
		el.scrollIntoView({ block: "center", behavior: "smooth" });
		const measure = () => {
			const r = el.getBoundingClientRect();
			setRect({ top: r.top - 8, left: r.left - 8, width: r.width + 16, height: r.height + 16 });
		};
		const id = setTimeout(measure, 350);
		window.addEventListener("resize", measure);
		window.addEventListener("scroll", measure, { passive: true });
		return () => {
			clearTimeout(id);
			window.removeEventListener("resize", measure);
			window.removeEventListener("scroll", measure);
		};
	}, [current]);

	const next = () => {
		if (step >= list.length - 1) onDone();
		else setStep(step + 1);
	};

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onDone();
			if (e.key === "ArrowRight" || e.key === "Enter") next();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});

	// Place the card below the spotlight, or above it when there's no room
	const below = rect ? rect.top + rect.height + 180 < window.innerHeight : true;
	const cardLeft = rect ? Math.min(Math.max(rect.left, 16), window.innerWidth - 300) : 16;

	if (!current || !rect) return null;

	return (
		<div className="tour-in fixed inset-0 z-[120]">
			<div className="absolute inset-0" onClick={onDone} />
			<div
				className="pointer-events-none absolute rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] ring-1 ring-white/50 transition-all duration-300 ease-out"
				style={rect}
			/>
			<div
				key={step}
				className="tour-in absolute w-[284px] rounded-xl border border-gray-200 bg-paper p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.4)]"
				style={{
					left: cardLeft,
					...(below
						? { top: rect.top + rect.height + 12 }
						: { top: rect.top - 12, transform: "translateY(-100%)" }),
				}}
			>
				<p className="font-mono text-[10px] uppercase tracking-wider text-gray-400">
					{step + 1} / {list.length}
				</p>
				<h3 className="mt-2 font-pixel text-[15px] text-ink">{current.title}</h3>
				<p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">{current.text}</p>
				<div className="mt-4 flex items-center justify-between">
					<button
						type="button"
						onClick={onDone}
						className="cursor-pointer font-mono text-[11px] text-gray-400 hover:text-ink"
					>
						skip
					</button>
					<button
						type="button"
						onClick={next}
						className="cursor-pointer rounded-md bg-ink px-3 py-1.5 font-mono text-[11px] text-paper hover:opacity-85"
					>
						{step === list.length - 1 ? "done" : "next →"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Tour;
