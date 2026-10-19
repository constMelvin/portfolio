import { useEffect, useRef, useState } from "react";
import Modal from "./modal";
import { cn } from "@/lib/utils";
import { store, useOverlay } from "@/lib/overlays";
import {
	certificates,
	education,
	experience,
	profile,
	projects,
	socials,
	stack,
} from "@/data/portfolio";

const list = (items: string[]) =>
	items.length > 1
		? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`
		: items[0];

// Keyword-matched answers built from the portfolio data — no AI backend needed
const rules: { keys: RegExp; answer: (name: string) => string }[] = [
	{
		keys: /\b(hi|hello|hey|yo|kumusta|musta|sup)\b/,
		answer: (name) =>
			`Hey ${name}! I'm ${profile.name.split(" ")[0]} — ask me about my projects, my stack, my studies, or how to reach me.`,
	},
	{
		keys: /stack|tech|skill|language|framework|tools?|know|use/,
		answer: () =>
			stack.map((g) => `${g.group}: ${list(g.items)}.`).join(" "),
	},
	{
		keys: /project|built|build|made|portfolio|app|work on/,
		answer: () =>
			`A few things I've built: ${projects
				.map((p) => `${p.name} (${p.tagline.replace(/\.$/, "")})`)
				.join("; ")}.`,
	},
	{
		keys: /experience|background|journey|career|start/,
		answer: () =>
			`I wrote my first line of code in ${profile.startedCoding}. Since then: ${experience
				.map((e) => `${e.title} (${e.period})`)
				.join(", ")}.`,
	},
	{
		keys: /school|study|studies|education|college|university|course|degree|student/,
		answer: () =>
			`I'm taking ${education[0].title} at ${education[0].detail}. Before that: ${education
				.slice(1)
				.map((e) => `${e.title} at ${e.detail}`)
				.join(", ")}.`,
	},
	{
		keys: /hire|available|open|intern|job|freelance|collab|work with/,
		answer: () =>
			`Yes — I'm open to internships, freelance work and collaborations. Email me at ${profile.email}.`,
	},
	{
		keys: /contact|email|reach|message|talk/,
		answer: () => `The best way is email: ${profile.email}. You can also find me on ${list(socials.map((s) => s.label))}.`,
	},
	{
		keys: /where|location|from|based|live/,
		answer: () => `I'm based in ${profile.location} (GMT+8).`,
	},
	{
		keys: /cv|resume|résumé/,
		answer: () => `You can grab my CV from the "Download CV" button at the top of the page.`,
	},
	{
		keys: /github|code|repo|open source/,
		answer: () => `My code lives at github.com/${profile.github} — the contributions graph is at the bottom of the page.`,
	},
	{
		keys: /certif|course|badge/,
		answer: () => `Certifications: ${list(certificates.map((c) => `${c.name} (${c.issuer})`))}.`,
	},
];

const answerFor = (question: string, name: string) => {
	const q = question.toLowerCase();
	const rule = rules.find((r) => r.keys.test(q));
	return rule
		? rule.answer(name)
		: `Good question, ${name}! I don't have an answer for that here yet — email me at ${profile.email} and I'll reply personally.`;
};

// Short fake "thinking" pause before answering
const thinkDelay = () => 700 + Math.random() * 500;

const suggestions = [
	"what's your tech stack?",
	"what have you built?",
	"are you open to work?",
	"where do you study?",
];

const AskAnything = () => {
	const { open, setOpen } = useOverlay();
	return (
		<Modal
			open={open === "ask"}
			onClose={() => setOpen(null)}
			label="Ask anything"
			className="mr-auto max-w-[760px] pl-[clamp(0.5rem,9vw,8rem)]"
			backdropClassName="bg-gray-50/85 backdrop-blur-lg"
		>
			<AskBody />
		</Modal>
	);
};

// Mounted only while the overlay is open, so every visit starts fresh
const AskBody = () => {
	const [name, setName] = useState(() => store.get("visitor-name") ?? "");
	const [text, setText] = useState("");
	const [thinking, setThinking] = useState(false);
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [shown, setShown] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);

	const askingName = !name;

	// Type the answer out character by character
	useEffect(() => {
		if (!answer) return;
		const id = setInterval(
			() =>
				setShown((n) => {
					if (n >= answer.length) clearInterval(id);
					return n + 2;
				}),
			18
		);
		return () => clearInterval(id);
	}, [answer]);

	const submit = (value: string) => {
		const v = value.trim();
		if (!v || thinking) return;
		setText("");
		if (askingName) {
			const first = v.split(" ")[0].slice(0, 24);
			setName(first);
			store.set("visitor-name", first);
			return;
		}
		setQuestion(v);
		setAnswer("");
		setThinking(true);
		setTimeout(() => {
			setThinking(false);
			setShown(0);
			setAnswer(answerFor(v, name));
		}, thinkDelay());
	};

	const title = askingName
		? "what's your name?"
		: question
			? thinking
				? "thinking…"
				: `anything else, ${name}?`
			: `what do you want to ask, ${name}?`;

	return (
			<div
				className="flex flex-col items-start gap-6"
				onClick={() => inputRef.current?.focus()}
			>
				{question && (
					<div className="relative ml-3 max-w-[min(85vw,600px)] rounded-xl bg-gray-200 px-3.5 py-2 font-mono text-[13px] text-ink before:absolute before:top-3 before:-left-[7px] before:border-y-[6px] before:border-r-[8px] before:border-y-transparent before:border-r-gray-200 before:content-['']">
						{question}
					</div>
				)}

				<div className="flex max-w-full items-center gap-[0.5em] text-[clamp(1.25rem,3.4vw,1.95rem)]">
					{thinking && (
						<span className="size-[0.6em] shrink-0 animate-spin rounded-[3px] border-2 border-gray-400 border-t-transparent" />
					)}
					<h2
						className={cn(
							"font-pixel leading-[1.15] text-ink lowercase",
							question ? "text-[clamp(1.25rem,3.4vw,1.95rem)]" : "text-[clamp(1.9rem,5.5vw,3.4rem)]",
							thinking && "animate-pulse text-gray-500"
						)}
					>
						{title}
					</h2>
				</div>

				{answer && (
					<p className="max-w-[min(92vw,660px)] font-mono text-[15px] leading-relaxed text-gray-600">
						{answer.slice(0, shown)}
					</p>
				)}

				<div className="flex min-h-10 max-w-[90vw] items-center font-mono text-[clamp(1.05rem,3vw,1.5rem)] text-ink">
					<span className={cn(!text && "text-gray-400")}>
						{text || (askingName ? "type your name" : "type a question")}
					</span>
					<span className="ml-[3px] inline-block h-[1.2em] w-0.5 animate-pulse bg-gray-500" />
				</div>

				{!askingName && !question && (
					<div className="flex flex-wrap gap-2">
						{suggestions.map((s) => (
							<button
								key={s}
								type="button"
								onClick={() => submit(s)}
								className="cursor-pointer rounded-full border border-gray-300 px-3 py-1 font-mono text-[11px] text-gray-500 transition-colors hover:border-ink hover:text-ink"
							>
								{s}
							</button>
						))}
					</div>
				)}

				<p className="font-mono text-[11px] text-gray-400">
					<kbd className="rounded-[5px] border border-gray-200 bg-gray-50 px-1.5 text-gray-500">↵</kbd>{" "}
					{askingName ? "next" : "ask"} ·{" "}
					<kbd className="rounded-[5px] border border-gray-200 bg-gray-50 px-1.5 text-gray-500">esc</kbd>{" "}
					close
				</p>

				<input
					ref={inputRef}
					autoFocus
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && submit(text)}
					autoComplete="off"
					autoCorrect="off"
					autoCapitalize="off"
					spellCheck={false}
					aria-label={askingName ? "Your name" : "Your question"}
					className="pointer-events-none absolute size-px opacity-0"
				/>
			</div>
		
	);
};

export default AskAnything;
