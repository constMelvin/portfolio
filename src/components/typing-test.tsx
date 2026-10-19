import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { RotateCcw, Trophy } from "lucide-react";
import Modal from "./modal";
import { cn } from "@/lib/utils";
import { useOverlay } from "@/lib/overlays";

const WORD_COUNT = 25;
const BEST_KEY = "tt-best-wpm";

const WORDS = `the be to of and a in that have it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us code build ship react type node data web page app bug fix test push file line debug stack array loop event state hook query fetch async deploy design simple clean fast small light`.split(
	" "
);

const KEY_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

const randomWords = () =>
	Array.from(
		{ length: WORD_COUNT },
		() => WORDS[Math.floor(Math.random() * WORDS.length)]
	);

const readBest = () => {
	try {
		return Number(localStorage.getItem(BEST_KEY)) || 0;
	} catch {
		return 0;
	}
};

const saveBest = (wpm: number) => {
	try {
		localStorage.setItem(BEST_KEY, String(wpm));
	} catch {
		// storage unavailable (private mode) — best score just won't persist
	}
};

const Stat = ({ value, unit, label }: { value: number; unit?: string; label: string }) => (
	<div className="flex flex-col items-center gap-1.5">
		<span className="font-mono text-[1.8rem] font-medium leading-none text-ink tabular-nums">
			<span className="inline-block min-w-[3ch] text-center">{value}</span>
			{unit && <i className="ml-px text-[0.9rem] not-italic text-gray-400">{unit}</i>}
		</span>
		<span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-gray-400">
			{label}
		</span>
	</div>
);

const Kbd = ({ children }: { children: React.ReactNode }) => (
	<kbd className="rounded-[5px] border border-gray-200 bg-gray-50 px-1.5 text-gray-500">
		{children}
	</kbd>
);

const TypingTest = () => {
	const { open, setOpen } = useOverlay();
	const isOpen = open === "typing";

	const [words, setWords] = useState<string[]>(randomWords);
	const [typed, setTyped] = useState("");
	const [startedAt, setStartedAt] = useState<number | null>(null);
	const [finishedAt, setFinishedAt] = useState<number | null>(null);
	const [now, setNow] = useState(0);
	const [keys, setKeys] = useState({ total: 0, correct: 0 });
	const [activeKey, setActiveKey] = useState<string | null>(null);
	const [best, setBest] = useState(readBest);
	const [beatBest, setBeatBest] = useState(false);
	const [caret, setCaret] = useState({ left: 0, top: 0 });

	const inputRef = useRef<HTMLInputElement>(null);
	const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

	const target = words.join(" ");
	const finished = finishedAt !== null;

	const restart = useCallback(() => {
		setWords(randomWords());
		setTyped("");
		setStartedAt(null);
		setFinishedAt(null);
		setKeys({ total: 0, correct: 0 });
		setBeatBest(false);
		requestAnimationFrame(() => inputRef.current?.focus());
	}, []);

	useEffect(() => {
		if (isOpen) restart();
	}, [isOpen, restart]);

	// Tick the clock while a test is running
	useEffect(() => {
		if (!startedAt || finished) return;
		const id = setInterval(() => setNow(Date.now()), 200);
		return () => clearInterval(id);
	}, [startedAt, finished]);

	// Move the caret to the next character to type
	useLayoutEffect(() => {
		const el = charRefs.current[Math.min(typed.length, target.length - 1)];
		if (!el) return;
		const atEnd = typed.length >= target.length;
		setCaret({
			left: el.offsetLeft + (atEnd ? el.offsetWidth : 0),
			top: el.offsetTop,
		});
	}, [typed, target, isOpen]);

	const elapsedMs = startedAt ? (finishedAt ?? now) - startedAt : 0;
	const minutes = Math.max(elapsedMs / 60000, 1 / 600);
	let correctChars = 0;
	for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) correctChars++;
	const wpm = startedAt ? Math.round(correctChars / 5 / minutes) : 0;
	const raw = startedAt ? Math.round(typed.length / 5 / minutes) : 0;
	const accuracy = keys.total ? Math.round((keys.correct / keys.total) * 100) : 100;
	const seconds = Math.floor(elapsedMs / 1000);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (finished) return;
		const value = e.target.value.slice(0, target.length);
		if (value.length > typed.length) {
			let correct = 0;
			for (let i = typed.length; i < value.length; i++)
				if (value[i] === target[i]) correct++;
			setKeys((k) => ({
				total: k.total + value.length - typed.length,
				correct: k.correct + correct,
			}));
		}
		const start = startedAt ?? Date.now();
		if (!startedAt) setStartedAt(start);
		setTyped(value);

		if (value.length === target.length) {
			const end = Date.now();
			setFinishedAt(end);
			let right = 0;
			for (let i = 0; i < value.length; i++) if (value[i] === target[i]) right++;
			const finalWpm = Math.round(right / 5 / Math.max((end - start) / 60000, 1 / 600));
			if (finalWpm > best) {
				setBest(finalWpm);
				setBeatBest(true);
				saveBest(finalWpm);
			}
		}
	};

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Tab" || (finished && e.key === "Enter")) {
			e.preventDefault();
			restart();
			return;
		}
		setActiveKey(e.key === " " ? " " : e.key.toLowerCase());
	};

	const nextKey = target[typed.length];
	let index = 0;

	return (
		<Modal
			open={isOpen}
			onClose={() => setOpen(null)}
			label="Typing test"
			className="max-w-[880px]"
			backdropClassName="bg-gray-50/85 backdrop-blur-lg"
		>
			<div
				className="flex flex-col items-center gap-7"
				onClick={() => inputRef.current?.focus()}
			>
				<input
					ref={inputRef}
					value={typed}
					onChange={onChange}
					onKeyDown={onKeyDown}
					onKeyUp={() => setActiveKey(null)}
					onBlur={() => setActiveKey(null)}
					autoComplete="off"
					autoCorrect="off"
					autoCapitalize="off"
					spellCheck={false}
					aria-label="Type the words shown"
					className="pointer-events-none absolute size-px opacity-0"
				/>

				{finished ? (
					<div className="flex flex-col items-center gap-6">
						<div className="flex flex-col items-center gap-1.5">
							<span className="font-pixel text-[5rem] leading-none text-ink tabular-nums">
								{wpm}
							</span>
							<span className="font-mono text-[11px] uppercase tracking-[0.16em] text-gray-400">
								words per minute
							</span>
						</div>
						<div className="flex gap-10">
							<Stat value={accuracy} unit="%" label="accuracy" />
							<Stat value={raw} label="raw" />
							<Stat value={seconds} unit="s" label="time" />
						</div>
						<p
							className={cn(
								"inline-flex items-center gap-2 font-mono text-[12.5px] text-gray-400",
								beatBest && "font-pixel text-[15px] text-ink"
							)}
						>
							<Trophy className={cn("size-3.5", beatBest ? "text-ink" : "text-gray-300")} />
							{beatBest ? "new personal best!" : `personal best · ${best} wpm`}
						</p>
						<button
							type="button"
							onClick={restart}
							className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-ink px-4 py-2 font-mono text-[12px] text-paper transition hover:-translate-y-px hover:opacity-90"
						>
							<RotateCcw className="size-3.5" /> try again
						</button>
					</div>
				) : (
					<>
						<div className="flex gap-10">
							<Stat value={wpm} label="wpm" />
							<Stat value={accuracy} unit="%" label="acc" />
							<Stat value={seconds} unit="s" label="time" />
						</div>

						<div className="h-[7.5rem] w-full overflow-hidden">
							<div
								className="relative font-pixel text-xl leading-[2.5rem] tracking-[0.02em] text-gray-300 select-none transition-transform duration-200 sm:text-2xl"
								style={{
									transform: `translateY(-${Math.max(0, caret.top - 40)}px)`,
								}}
							>
								{words.map((word, w) => (
									<span key={w} className="inline-block whitespace-nowrap">
										{[...word, ...(w < words.length - 1 ? [" "] : [])].map((ch) => {
											const i = index++;
											const state =
												i >= typed.length
													? ""
													: typed[i] === ch
														? "text-ink"
														: ch === " "
															? "bg-[#e0584f]/30"
															: "text-[#e0584f]";
											return (
												<span
													key={i}
													ref={(el) => {
														charRefs.current[i] = el;
													}}
													className={cn("transition-colors duration-100", state)}
												>
													{ch === " " ? " " : ch}
												</span>
											);
										})}
									</span>
								))}
								<span
									aria-hidden="true"
									className={cn(
										"absolute w-0.5 rounded-sm bg-ink transition-all duration-100 ease-out",
										!startedAt && "animate-pulse"
									)}
									style={{
										left: caret.left,
										top: caret.top + 8,
										height: "1.5rem",
									}}
								/>
							</div>
						</div>

						<div className="hidden flex-col items-center gap-1.5 sm:flex">
							{[...KEY_ROWS, " "].map((row) => (
								<div key={row} className="flex gap-1.5">
									{[...row].map((k) => (
										<span
											key={k}
											className={cn(
												"flex h-9 min-w-9 items-center justify-center rounded-[0.6rem] border border-gray-200 bg-gray-100 px-2 font-mono text-[12px] text-gray-500 shadow-[0_2px_0_rgb(var(--g200))] transition-all duration-75",
												k === " " && "min-w-60 text-[10px] uppercase tracking-[0.12em] text-gray-400",
												nextKey?.toLowerCase() === k &&
													"border-gray-300 text-ink shadow-[0_0_0_3px_rgb(var(--ink)/0.06),0_2px_0_rgb(var(--g200))]",
												activeKey === k &&
													"translate-y-0.5 bg-gray-200 text-ink shadow-none"
											)}
										>
											{k === " " ? "space" : k}
										</span>
									))}
								</div>
							))}
						</div>
					</>
				)}

				<div className="flex gap-4 font-mono text-[11px] text-gray-400">
					<span>
						<Kbd>tab</Kbd> restart
					</span>
					<span>
						<Kbd>esc</Kbd> close
					</span>
				</div>
			</div>
		</Modal>
	);
};

export default TypingTest;
