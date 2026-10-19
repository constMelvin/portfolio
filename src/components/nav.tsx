import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowRight,
	Award,
	Briefcase,
	FolderGit2,
	Github,
	GraduationCap,
	Handshake,
	Keyboard,
	Layers,
	Mail,
	Menu,
	MessagesSquare,
	NotebookPen,
	Quote,
	Sparkles,
	X,
	type LucideIcon,
} from "lucide-react";
import Presence from "./presence";
import ThemeSwitch from "./theme-switch";
import { ThemeToggleButton } from "./theme-toggle";
import { modKey, useOverlay } from "@/lib/overlays";
import { profile } from "@/data/portfolio";

// `to` is a page route, or "/#id" for sections that only live on the home page
type NavItem = { to: string; label: string; icon: LucideIcon };

const navGroups: NavItem[][] = [
	[
		{ to: "/blog", label: "Blog", icon: NotebookPen },
		{ to: "/projects", label: "Projects", icon: FolderGit2 },
	],
	[
		{ to: "/experience", label: "Experience", icon: Briefcase },
		{ to: "/education", label: "Education", icon: GraduationCap },
		{ to: "/stack", label: "Stack", icon: Layers },
	],
	[
		{ to: "/certifications", label: "Certifications", icon: Award },
		{ to: "/recommendations", label: "Recommendations", icon: Quote },
		{ to: "/affiliations", label: "Affiliations", icon: Handshake },
		{ to: "/#github", label: "GitHub", icon: Github },
		{ to: "/#contact", label: "Contact", icon: Mail },
	],
];

// The nav item matching the current page (or home-page #section)
const useActivePath = () => {
	const { pathname, hash } = useLocation();
	return hash && pathname === "/" ? `/${hash}` : pathname;
};

const Shortcut = ({ k }: { k: string }) => (
	<span className="inline-flex items-center gap-1">
		<kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] leading-none text-gray-500">
			{modKey}
		</kbd>
		<span className="font-mono text-[10px] text-gray-400">+</span>
		<kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] leading-none text-gray-500">
			{k}
		</kbd>
	</span>
);

export const Sidebar = () => {
	const active = useActivePath();
	const { setOpen } = useOverlay();

	return (
		<nav
			data-guide="sidebar"
			className="fixed inset-y-0 left-0 z-50 hidden w-56 flex-col border-r border-gray-200 bg-paper px-7 py-8 lg:flex"
		>
			<Link to="/" className="shrink-0 font-pixel text-[15px] leading-none hover:opacity-60">
				{profile.shortName}
			</Link>

			<div className="mt-9 flex flex-1 flex-col gap-4 overflow-y-auto font-mono text-[13px] [scrollbar-width:none]">
				{navGroups.map((group, i) => (
					<div key={i} className="flex flex-col gap-4">
						{i > 0 && <div className="h-px bg-gray-200" />}
						<div className="flex flex-col gap-2.5">
							{group.map(({ to, label, icon: Icon }) => (
								<Link
									key={to}
									to={to}
									className={
										"relative inline-flex w-fit items-center gap-2.5 transition-colors hover:text-ink " +
										(active === to ? "text-ink" : "text-gray-500")
									}
								>
									{/* Active page: the icon turns into an arrow, like the reference */}
									{active === to ? (
										<ArrowRight key="arrow" className="nav-arrow size-[1.15em] shrink-0" />
									) : (
										<Icon className="size-[1.15em] shrink-0" />
									)}
									{label}
								</Link>
							))}
						</div>
					</div>
				))}
			</div>

			<button
				type="button"
				data-guide="ask"
				onClick={() => setOpen("ask")}
				className="mt-6 inline-flex w-fit cursor-pointer items-center gap-2 text-[12px] text-gray-400 hover:text-ink"
			>
				<span>Ask anything</span>
				<Shortcut k="K" />
			</button>
			<button
				type="button"
				onClick={() => setOpen("typing")}
				className="mt-2.5 inline-flex w-fit cursor-pointer items-center gap-2 text-[12px] text-gray-400 hover:text-ink"
			>
				<span>Typing test</span>
				<Shortcut k="J" />
			</button>

			<div className="mt-4">
				<Presence />
			</div>

			<div className="mt-6 shrink-0">
				<div className="mb-4">
					<ThemeSwitch />
				</div>
				<p className="text-[12px] leading-relaxed text-gray-400">
					For work, collabs &amp; everything else, reach me at
				</p>
				<button
					type="button"
					data-guide="email"
					onClick={() => setOpen("email")}
					className="mt-1.5 inline-flex w-fit max-w-full cursor-pointer items-center gap-2 font-mono text-[13px] text-ink hover:text-gray-500"
				>
					<Mail className="size-3.5 shrink-0" />
					<span className="truncate">{profile.email}</span>
				</button>
			</div>
		</nav>
	);
};

export const MobileNav = () => {
	const [open, setOpen] = useState(false);
	const overlay = useOverlay();
	const active = useActivePath();

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
	}, [open]);

	const extras = [
		{ label: "Ask anything", icon: Sparkles, run: () => overlay.setOpen("ask") },
		{ label: "Typing test", icon: Keyboard, run: () => overlay.setOpen("typing") },
		{ label: "Community chat", icon: MessagesSquare, run: () => overlay.setOpen("chat") },
		{ label: "Email me", icon: Mail, run: () => overlay.setOpen("email") },
	];

	return (
		<>
			<header className="sticky top-0 z-50 border-b border-gray-200/70 bg-paper/90 backdrop-blur-md lg:hidden">
				<div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-3">
					<Link to="/" className="font-pixel text-[14px]">
						{profile.shortName}
					</Link>
					<div className="flex items-center gap-3">
						<button
							type="button"
							data-guide="ask"
							onClick={() => overlay.setOpen("ask")}
							aria-label="Ask anything"
							className="cursor-pointer p-1 text-gray-700 hover:text-ink"
						>
							<Sparkles className="size-[18px]" />
						</button>
						<ThemeToggleButton className="size-8 p-1.5" />
						<button
							type="button"
							data-guide="sidebar"
							onClick={() => setOpen(true)}
							aria-label="Open menu"
							className="-mr-1 cursor-pointer p-1 text-gray-700 hover:text-ink"
						>
							<Menu className="size-5" />
						</button>
					</div>
				</div>
			</header>

			<AnimatePresence>
				{open && (
					<motion.div
						className="fixed inset-0 z-[60] flex flex-col bg-paper lg:hidden"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
							<span className="font-pixel text-[14px]">{profile.shortName}</span>
							<button
								type="button"
								onClick={() => setOpen(false)}
								aria-label="Close menu"
								className="-mr-1 cursor-pointer p-1 text-gray-700 hover:text-ink"
							>
								<X className="size-5" />
							</button>
						</div>
						<div className="flex flex-1 flex-col gap-6 overflow-y-auto px-7 py-8 font-mono text-[16px]">
							{[...navGroups, extras].map((group, i) => (
								<motion.div
									key={i}
									className="flex flex-col gap-4"
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.05 + i * 0.05 }}
								>
									{i > 0 && <div className="h-px bg-gray-200" />}
									{group.map((item) =>
										"to" in item ? (
											<Link
												key={item.to}
												to={item.to}
												onClick={() => setOpen(false)}
												className={
													"inline-flex w-fit items-center gap-3 hover:text-ink " +
													(active === item.to ? "text-ink" : "text-gray-700")
												}
											>
												{active === item.to ? (
													<ArrowRight className="nav-arrow size-[1.15em] shrink-0" />
												) : (
													<item.icon className="size-[1.15em] shrink-0" />
												)}
												{item.label}
											</Link>
										) : (
											<button
												key={item.label}
												type="button"
												onClick={() => {
													setOpen(false);
													item.run();
												}}
												className="inline-flex w-fit cursor-pointer items-center gap-3 text-gray-700 hover:text-ink"
											>
												<item.icon className="size-[1.15em] shrink-0" />
												{item.label}
											</button>
										)
									)}
								</motion.div>
							))}
							<div className="mt-auto">
								<ThemeSwitch />
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};
