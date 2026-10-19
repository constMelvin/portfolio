import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Blurred full-screen overlay with a centered panel; closes on backdrop click or Esc
const Modal = ({
	open,
	onClose,
	label,
	className,
	backdropClassName,
	children,
}: {
	open: boolean;
	onClose: () => void;
	label: string;
	className?: string;
	backdropClassName?: string;
	children: React.ReactNode;
}) => {
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", onKey);
		};
	}, [open, onClose]);

	return (
		<AnimatePresence>
			{open && (
				<div
					role="dialog"
					aria-modal="true"
					aria-label={label}
					className="fixed inset-0 z-[100] flex items-center justify-center p-5"
				>
					<motion.div
						className={cn(
							"absolute inset-0 bg-ink/30 backdrop-blur-md",
							backdropClassName
						)}
						onClick={onClose}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					/>
					<motion.div
						className={cn("relative w-full", className)}
						initial={{ opacity: 0, y: 12, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 8, scale: 0.98 }}
						transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
					>
						{children}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default Modal;
