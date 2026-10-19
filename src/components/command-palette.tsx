import { useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import {
	ArrowUpRight,
	Award,
	Briefcase,
	Copy,
	CornerDownLeft,
	Download,
	FolderGit2,
	GraduationCap,
	Keyboard,
	Layers,
	Mail,
	Moon,
	Search,
	type LucideIcon,
} from "lucide-react";
import Modal from "./modal";
import { cn } from "@/lib/utils";
import { useOverlay } from "@/lib/overlays";
import { profile, socials } from "@/data/portfolio";

type Command = {
	group: "Navigate" | "Actions" | "Links";
	label: string;
	icon: LucideIcon;
	hint?: string;
	run: () => void;
};

const CommandPalette = () => {
	const { open, setOpen } = useOverlay();
	return (
		<Modal
			open={open === "command"}
			onClose={() => setOpen(null)}
			label="Command palette"
			className="mt-[12vh] max-w-lg self-start"
		>
			<PaletteBody />
		</Modal>
	);
};

const PaletteBody = () => {
	const { setOpen } = useOverlay();
	const { resolvedTheme, setTheme } = useTheme();
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState(0);

	const commands = useMemo<Command[]>(() => {
		const nav = (label: string, to: string, icon: LucideIcon): Command => ({
			group: "Navigate",
			label,
			icon,
			run: () => navigate(to),
		});
		return [
			nav("Projects", "/projects", FolderGit2),
			nav("Experience", "/experience", Briefcase),
			nav("Education", "/education", GraduationCap),
			nav("Stack", "/stack", Layers),
			nav("Certifications", "/certifications", Award),
			nav("Contact", "/#contact", Mail),
			{
				group: "Actions",
				label: "Copy email",
				icon: Copy,
				hint: profile.email,
				run: () => navigator.clipboard.writeText(profile.email),
			},
			{
				group: "Actions",
				label: "Send email",
				icon: Mail,
				run: () => (window.location.href = `mailto:${profile.email}`),
			},
			{
				group: "Actions",
				label: "Download CV",
				icon: Download,
				run: () => window.open(profile.cv, "_blank"),
			},
			{
				group: "Actions",
				label: "Typing test",
				icon: Keyboard,
				run: () => setOpen("typing"),
			},
			{
				group: "Actions",
				label: `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`,
				icon: Moon,
				run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
			},
			...socials.map<Command>((s) => ({
				group: "Links",
				label: s.label,
				icon: ArrowUpRight,
				run: () => window.open(s.href, "_blank", "noopener"),
			})),
		];
	}, [resolvedTheme, setTheme, setOpen, navigate]);

	const results = commands.filter((c) =>
		c.label.toLowerCase().includes(query.trim().toLowerCase())
	);

	const run = (command: Command | undefined) => {
		if (!command) return;
		// Opening another overlay replaces this one, so only close for other commands
		if (command.label !== "Typing test") setOpen(null);
		command.run();
	};

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelected((i) => (i + 1) % Math.max(results.length, 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelected((i) => (i - 1 + results.length) % Math.max(results.length, 1));
		} else if (e.key === "Enter") {
			e.preventDefault();
			run(results[selected]);
		}
	};

	// Show each group header above its first result
	const headers = results.map((c, i) => (i === 0 || results[i - 1].group !== c.group ? c.group : null));

	return (
			<div className="overflow-hidden rounded-2xl border border-gray-200 bg-paper shadow-[0_40px_90px_-20px_rgba(0,0,0,0.35)]">
				<div className="flex items-center gap-3 border-b border-gray-200 px-4">
					<Search className="size-4 shrink-0 text-gray-400" />
					<input
						autoFocus
						value={query}
						onChange={(e) => {
							setQuery(e.target.value);
							setSelected(0);
						}}
						onKeyDown={onKeyDown}
						placeholder="Search or jump to…"
						className="h-12 w-full bg-transparent font-mono text-[13px] text-ink outline-none placeholder:text-gray-400"
					/>
					<kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">
						esc
					</kbd>
				</div>

				<div className="max-h-[50vh] overflow-y-auto p-2">
					{results.length === 0 && (
						<p className="px-3 py-8 text-center font-mono text-[12px] text-gray-400">
							no results for “{query}”
						</p>
					)}
					{results.map((command, i) => {
						const header = headers[i];
						return (
							<div key={command.label}>
								{header && (
									<p className="px-3 pt-3 pb-1.5 font-mono text-[10px] uppercase tracking-wider text-gray-400">
										{header}
									</p>
								)}
								<button
									type="button"
									onMouseMove={() => setSelected(i)}
									onClick={() => run(command)}
									className={cn(
										"flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] transition-colors",
										i === selected
											? "bg-gray-100 text-ink"
											: "text-gray-600"
									)}
								>
									<command.icon className="size-4 shrink-0 text-gray-400" />
									<span className="flex-1 truncate">{command.label}</span>
									{command.hint && (
										<span className="truncate font-mono text-[11px] text-gray-400">
											{command.hint}
										</span>
									)}
									{i === selected && (
										<CornerDownLeft className="size-3.5 shrink-0 text-gray-400" />
									)}
								</button>
							</div>
						);
					})}
				</div>

				<div className="flex items-center gap-4 border-t border-gray-200 px-4 py-2.5 font-mono text-[10px] text-gray-400">
					<span>
						<kbd className="rounded border border-gray-200 bg-gray-50 px-1">↑</kbd>{" "}
						<kbd className="rounded border border-gray-200 bg-gray-50 px-1">↓</kbd>{" "}
						navigate
					</span>
					<span>
						<kbd className="rounded border border-gray-200 bg-gray-50 px-1">↵</kbd>{" "}
						select
					</span>
				</div>
			</div>
	);
};

export default CommandPalette;
