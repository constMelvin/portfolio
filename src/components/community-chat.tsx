import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import Modal from "./modal";
import { store, useOverlay } from "@/lib/overlays";
import { profile } from "@/data/portfolio";

// NOTE: messages are saved in this browser only. To make the chat shared between
// visitors, swap load/save for a realtime backend (Supabase, Firebase, Liveblocks…).
type Message = { id: number; name: string; text: string; at: number; mine?: boolean };

const KEY = "community-chat";

const avatar = (seed: string) =>
	`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&radius=50&backgroundColor=f1f1f1`;

const welcome: Message = {
	id: 0,
	name: profile.shortName,
	text: "Hey! Thanks for stopping by — leave a message 👋",
	at: 0, // pinned
};

const load = (): Message[] => {
	try {
		return JSON.parse(store.get(KEY) ?? "[]");
	} catch {
		return [];
	}
};

const timeAgo = (at: number) => {
	const s = Math.floor((Date.now() - at) / 1000);
	if (s < 60) return "now";
	if (s < 3600) return `${Math.floor(s / 60)}m`;
	if (s < 86400) return `${Math.floor(s / 3600)}h`;
	return `${Math.floor(s / 86400)}d`;
};

// Little WASD playground: move your pixel around and collect dots
const Playground = ({ name }: { name: string }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [playing, setPlaying] = useState(false);
	const [score, setScore] = useState(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const c = canvas.getContext("2d")!;
		const W = canvas.width;
		const H = canvas.height;
		const keys = new Set<string>();
		const player = { x: W / 2, y: H * 0.75 };
		const dot = { x: 80, y: 80 };
		const ink = () => getComputedStyle(document.documentElement).getPropertyValue("--ink");
		let frame = 0;

		const onDown = (e: KeyboardEvent) => {
			if (document.activeElement !== canvas) return;
			keys.add(e.key.toLowerCase());
			if (e.key.startsWith("Arrow")) e.preventDefault();
		};
		const onUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
		window.addEventListener("keydown", onDown);
		window.addEventListener("keyup", onUp);

		const loop = () => {
			const speed = 3;
			if (keys.has("w") || keys.has("arrowup")) player.y -= speed;
			if (keys.has("s") || keys.has("arrowdown")) player.y += speed;
			if (keys.has("a") || keys.has("arrowleft")) player.x -= speed;
			if (keys.has("d") || keys.has("arrowright")) player.x += speed;
			player.x = Math.max(8, Math.min(W - 8, player.x));
			player.y = Math.max(8, Math.min(H - 8, player.y));

			if (Math.hypot(player.x - dot.x, player.y - dot.y) < 14) {
				dot.x = 20 + Math.random() * (W - 40);
				dot.y = 20 + Math.random() * (H - 40);
				setScore((s) => s + 1);
			}

			const color = `rgb(${ink()})`;
			c.clearRect(0, 0, W, H);
			// halftone grid
			c.fillStyle = color;
			c.globalAlpha = 0.12;
			for (let x = 10; x < W; x += 13)
				for (let y = 10; y < H; y += 13) c.fillRect(x, y, 1.5, 1.5);
			c.globalAlpha = 0.5 + Math.sin(frame / 10) * 0.3;
			c.fillRect(dot.x - 4, dot.y - 4, 8, 8);
			c.globalAlpha = 1;
			c.fillRect(player.x - 7, player.y - 7, 14, 14);
			c.font = "11px 'Geist Mono', monospace";
			c.fillText(name || "you", player.x - 10, player.y - 14);
			frame++;
			raf = requestAnimationFrame(loop);
		};
		let raf = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("keydown", onDown);
			window.removeEventListener("keyup", onUp);
		};
	}, [name]);

	return (
		<div className="hidden w-[460px] shrink-0 xl:block">
			<div className="mb-2 flex justify-between px-0.5 font-mono text-[10px] text-gray-400">
				<span>score · {score}</span>
				<span>wasd / arrows to move</span>
			</div>
			<div className="relative [mask-image:radial-gradient(ellipse_at_center,#000_70%,transparent_100%)]">
				<canvas
					ref={canvasRef}
					width={460}
					height={380}
					tabIndex={0}
					onFocus={() => setPlaying(true)}
					onBlur={() => setPlaying(false)}
					aria-label="Playground game"
					className="block cursor-pointer outline-none"
				/>
				{!playing && (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 font-mono text-[12px] text-gray-600">
						click to play ·{" "}
						{["W", "A", "S", "D"].map((k) => (
							<kbd key={k} className="rounded-[5px] border border-gray-300 px-1.5 text-[10px] text-gray-500">
								{k}
							</kbd>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

const CommunityChat = () => {
	const { open, setOpen } = useOverlay();
	return (
		<Modal
			open={open === "chat"}
			onClose={() => setOpen(null)}
			label="Community chat"
			className="flex max-w-6xl items-center justify-between gap-10 pl-[clamp(0.5rem,9vw,8rem)]"
			backdropClassName="bg-gray-50/85 backdrop-blur-lg"
		>
			<ChatBody />
		</Modal>
	);
};

const ChatBody = () => {
	const [name, setName] = useState(() => store.get("visitor-name") ?? "");
	const [messages, setMessages] = useState<Message[]>(load);
	const [text, setText] = useState("");
	const listRef = useRef<HTMLDivElement>(null);

	const all = [welcome, ...messages];

	useEffect(() => {
		listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
	}, [messages]);

	const save = (next: Message[]) => {
		setMessages(next);
		store.set(KEY, JSON.stringify(next.slice(-50)));
	};

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		const v = text.trim();
		if (!v) return;
		setText("");
		if (!name) {
			const first = v.split(" ")[0].slice(0, 24);
			setName(first);
			store.set("visitor-name", first);
			return;
		}
		save([...messages, { id: Date.now(), name, text: v.slice(0, 280), at: Date.now(), mine: true }]);
	};

	return (
		<>
			<div className="flex w-full max-w-[560px] flex-col">
				<h2 className="mb-5 font-pixel text-[clamp(1.6rem,4vw,2.2rem)] leading-tight text-ink lowercase">
					community chat
				</h2>
				<div className="mb-2 flex items-center gap-1.5 pl-1 font-mono text-[11px] text-gray-400">
					<MessageCircle className="size-3" /> {all.length} message{all.length === 1 ? "" : "s"} · saved on this device
				</div>

				<div
					ref={listRef}
					className="flex h-[min(340px,50vh)] flex-col gap-3 overflow-y-auto pr-2 [scrollbar-width:none] [mask-image:linear-gradient(to_bottom,transparent_0,#000_30px)]"
				>
					<div className="mt-auto" />
					{all.map((m) => (
						<div key={m.id} className="flex max-w-[92%] items-end gap-2">
							<img src={avatar(m.name)} alt="" className="ml-1 size-7 shrink-0 rounded-full bg-gray-100 shadow-[0_0_0_1px_rgb(var(--ink)/0.08)]" />
							<div className="flex min-w-0 flex-col gap-1">
								<span className="flex items-center gap-1.5 pl-1 font-mono text-[11px] text-gray-500">
									<span className={m.mine ? "font-bold text-ink" : "text-gray-600"}>{m.name}</span>
									<span className="text-gray-300">·</span>
									<span className="text-[9.5px] text-gray-400">{m.at ? timeAgo(m.at) : "pinned"}</span>
								</span>
								<div className="group relative">
									<p className="rounded-xl rounded-bl-sm bg-gray-200 px-3 py-2 font-pixel text-[13px] leading-normal break-words text-ink">
										{m.text}
									</p>
									{m.mine && (
										<button
											type="button"
											aria-label="Delete message"
											onClick={() => save(messages.filter((x) => x.id !== m.id))}
											className="absolute -top-2 -left-2 hidden size-[19px] cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-paper text-gray-500 group-hover:flex hover:bg-ink hover:text-paper"
										>
											<X className="size-3" />
										</button>
									)}
								</div>
							</div>
						</div>
					))}
				</div>

				<form onSubmit={submit} className="mt-7 flex max-w-[92%] flex-col gap-2">
					<div className="font-mono text-[12.5px] text-gray-500">
						{name ? (
							<>
								chatting as <b className="font-semibold text-ink">{name}</b>
							</>
						) : (
							"what's your name?"
						)}
					</div>
					<div className="flex items-center gap-3">
						<input
							autoFocus
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder={name ? "say something nice" : "your name"}
							maxLength={name ? 280 : 40}
							autoComplete="off"
							className="min-w-0 flex-1 bg-transparent py-1 font-mono text-[15px] text-ink outline-none placeholder:text-gray-400"
						/>
						<button
							type="submit"
							disabled={!text.trim()}
							className="cursor-pointer px-0.5 py-1 font-mono text-[12px] text-gray-500 transition-colors hover:text-ink disabled:opacity-35"
						>
							{name ? "send ↵" : "next ↵"}
						</button>
					</div>
				</form>
			</div>

			<Playground name={name} />
		</>
	);
};

export default CommunityChat;
