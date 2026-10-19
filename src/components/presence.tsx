import { useState } from "react";
import { MessagesSquare } from "lucide-react";
import { store, useOverlay } from "@/lib/overlays";

// Viewer count. Without a backend it can only see this visitor, so it shows 1.
// Hook it up to a realtime presence service (Supabase Realtime, Liveblocks…) to make it live.
const Presence = () => {
	const { setOpen } = useOverlay();
	const [seed] = useState(() => store.get("visitor-name") || "visitor");

	return (
		<div className="border-y border-gray-200 py-3.5">
			<span className="inline-flex items-center">
				<img
					alt=""
					src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&radius=50&backgroundColor=f1f1f1`}
					className="size-[19px] rounded-full bg-gray-100 shadow-[0_0_0_1.5px_rgb(var(--paper)),0_0_0_2.5px_rgb(var(--g200))]"
				/>
			</span>
			<p className="mt-1 font-pixel text-[10.5px] text-gray-400">
				<b className="font-bold text-ink">1</b> person viewing now
			</p>
			<button
				type="button"
				onClick={() => setOpen("chat")}
				className="mt-3.5 inline-flex w-fit cursor-pointer items-center gap-2 font-mono text-[12px] text-gray-500 hover:text-ink"
			>
				<MessagesSquare className="size-3.5" /> community chat
			</button>
		</div>
	);
};

export default Presence;
