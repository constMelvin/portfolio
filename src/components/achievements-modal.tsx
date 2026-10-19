import { ArrowUpRight, Trophy, X } from "lucide-react";
import Modal from "./modal";
import { useOverlay } from "@/lib/overlays";
import { achievements } from "@/data/portfolio";

const AchievementsModal = () => {
	const { open, setOpen } = useOverlay();
	const featured = achievements.filter((a) => a.featured);
	const others = achievements.filter((a) => !a.featured);

	return (
		<Modal
			open={open === "achievements"}
			onClose={() => setOpen(null)}
			label="Achievements"
			className="max-w-xl"
		>
			<div className="relative max-h-[88vh] overflow-y-auto rounded-2xl border border-gray-200 bg-paper p-7 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.35)] sm:p-8">
				<button
					type="button"
					onClick={() => setOpen(null)}
					aria-label="Close"
					className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-ink"
				>
					<X className="size-4" />
				</button>
				<div className="flex items-baseline justify-between gap-3 pr-6">
					<div>
						<p className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
							Achievements
						</p>
						<h2 className="mt-3 font-pixel text-2xl leading-none">
							{achievements.length}
							<span className="text-gray-300">x</span> wins &amp; awards
						</h2>
					</div>
					<span className="hidden font-mono text-[11px] uppercase tracking-wider text-gray-400 sm:block">
						Selected highlights
					</span>
				</div>

				{featured.map((a) => (
					<a
						key={a.title}
						href={a.href ?? "#"}
						target="_blank"
						rel="noopener"
						className="group mt-5 block rounded-xl border border-ink bg-ink p-5 text-paper"
					>
						<div className="flex items-center justify-between gap-3">
							<span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider opacity-70">
								<Trophy className="size-3" /> {a.result} · {a.year}
							</span>
							<span className="rounded-full bg-paper/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider">
								Featured
							</span>
						</div>
						<h3 className="mt-3 text-[17px] font-semibold">{a.title}</h3>
						{a.href && (
							<span className="mt-2 flex items-center gap-1.5 font-mono text-[12px] opacity-70 group-hover:opacity-100">
								Read more <ArrowUpRight className="size-3.5" />
							</span>
						)}
					</a>
				))}

				<div className="mt-5 divide-y divide-gray-200 border-y border-gray-200">
					{others.map((a) => (
						<div key={a.title} className="flex items-baseline justify-between gap-4 py-2.5">
							<span className="text-[14px] font-medium text-ink">{a.title}</span>
							<span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-gray-400">
								{a.result} · {a.year}
							</span>
						</div>
					))}
				</div>
			</div>
		</Modal>
	);
};

export default AchievementsModal;
