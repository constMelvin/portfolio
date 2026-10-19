import { useOverlay } from "@/lib/overlays";
import { profile } from "@/data/portfolio";

const Footer = () => {
	const { startTour } = useOverlay();

	return (
		<footer className="border-t border-gray-200">
			<div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-6 py-8">
				<span className="font-pixel text-[14px]">{profile.shortName}</span>
				<div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-wider text-gray-400">
					<span className="hidden sm:inline">© {new Date().getFullYear()}</span>
					<button
						type="button"
						onClick={startTour}
						className="cursor-pointer uppercase tracking-wider transition-colors hover:text-ink"
					>
						take the tour again
					</button>
					<button
						type="button"
						onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
						className="cursor-pointer uppercase tracking-wider transition-colors hover:text-ink"
					>
						top ↑
					</button>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
