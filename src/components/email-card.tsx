import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { profile } from "@/data/portfolio";

// "say hello" panel, used inline in the contact section and inside the email modal
const EmailCard = ({
	onClose,
	className,
}: {
	onClose?: () => void;
	className?: string;
}) => {
	const [copied, setCopied] = useState(false);

	const copyEmail = async () => {
		await navigator.clipboard.writeText(profile.email);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div
			className={cn(
				"relative max-w-sm rounded-2xl border border-gray-200 bg-paper p-7 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.35)]",
				className
			)}
		>
			{onClose && (
				<button
					type="button"
					onClick={onClose}
					aria-label="Close"
					className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-ink"
				>
					<X className="size-4" />
				</button>
			)}
			<p className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
				Get in touch
			</p>
			<h3 className="mt-3 font-pixel text-xl leading-none">say hello</h3>
			<p className="mt-3 text-[14px] leading-relaxed text-gray-600">
				Open to internships, freelance work and collaborations — drop me a
				line.
			</p>
			<div className="mt-5 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-1.5">
				<span className="flex-1 truncate px-2 font-mono text-[13px] text-ink">
					{profile.email}
				</span>
				<button
					type="button"
					onClick={copyEmail}
					className="shrink-0 cursor-pointer rounded-md bg-ink px-3 py-1.5 text-[12px] font-medium text-paper transition-opacity hover:opacity-85"
				>
					{copied ? "Copied!" : "Copy"}
				</button>
			</div>
			<a
				href={`mailto:${profile.email}`}
				className="mt-3 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-ink transition-colors hover:border-ink"
			>
				Open mail app
			</a>
		</div>
	);
};

export default EmailCard;
