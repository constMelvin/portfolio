import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { profile } from "@/data/portfolio";

// Profile photo that tilts toward the cursor, wherever it is on the page
const GazePhoto = () => {
	const ref = useRef<HTMLDivElement>(null);
	const reduce = useReducedMotion();
	const rotateX = useSpring(0, { stiffness: 120, damping: 18 });
	const rotateY = useSpring(0, { stiffness: 120, damping: 18 });

	useEffect(() => {
		if (reduce) return;
		const onMove = (e: PointerEvent) => {
			const el = ref.current;
			if (!el) return;
			const r = el.getBoundingClientRect();
			const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
			const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
			rotateY.set(Math.max(-1, Math.min(1, dx * 2)) * 10);
			rotateX.set(Math.max(-1, Math.min(1, dy * 2)) * -10);
		};
		const reset = () => {
			rotateX.set(0);
			rotateY.set(0);
		};
		window.addEventListener("pointermove", onMove);
		document.addEventListener("pointerleave", reset);
		return () => {
			window.removeEventListener("pointermove", onMove);
			document.removeEventListener("pointerleave", reset);
		};
	}, [reduce, rotateX, rotateY]);

	return (
		<div ref={ref} className="relative [perspective:800px]">
			<div aria-hidden="true" className="halftone mask-circle absolute -inset-6 opacity-25" />
			<motion.img
				src={profile.photo}
				alt={profile.name}
				width={416}
				height={416}
				style={{ rotateX, rotateY }}
				className="relative block h-auto w-full rounded-2xl border border-gray-200 bg-white shadow-[0_18px_40px_-24px_rgba(10,10,10,0.45)] select-none"
				draggable={false}
			/>
		</div>
	);
};

export default GazePhoto;
