import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { onSoundsChange, setSoundsEnabled, soundsEnabled } from "@/lib/sound";

const options = [
	{ value: "system", icon: Monitor, label: "System" },
	{ value: "light", icon: Sun, label: "Light" },
	{ value: "dark", icon: Moon, label: "Dark" },
] as const;

// System / light / dark segmented switch plus the UI-sound toggle (sidebar footer)
const ThemeSwitch = () => {
	const { theme, setTheme } = useTheme();
	const [sounds, setSounds] = useState(soundsEnabled);

	useEffect(() => onSoundsChange(setSounds), []);

	const choose = (value: string) => {
		if (!document.startViewTransition) return setTheme(value);
		document.startViewTransition(() => setTheme(value));
	};

	return (
		<div className="flex items-center gap-2">
			<div
				role="group"
				aria-label="Theme"
				className="inline-flex items-center gap-px rounded-full border border-gray-200 p-0.5"
			>
				{options.map(({ value, icon: Icon, label }) => (
					<button
						key={value}
						type="button"
						title={label}
						aria-label={`${label} theme`}
						aria-pressed={theme === value}
						onClick={() => choose(value)}
						className={cn(
							"inline-flex size-[1.35rem] cursor-pointer items-center justify-center rounded-full transition-colors hover:text-ink",
							theme === value ? "bg-gray-100 text-ink" : "text-gray-400"
						)}
					>
						<Icon className="size-[13px]" />
					</button>
				))}
			</div>
			<button
				type="button"
				onClick={() => setSoundsEnabled(!sounds)}
				aria-pressed={sounds}
				aria-label={sounds ? "Disable interface sounds" : "Enable interface sounds"}
				title={sounds ? "Sounds on" : "Sounds off"}
				className="inline-flex size-[30px] cursor-pointer items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-ink"
			>
				{sounds ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
			</button>
		</div>
	);
};

export default ThemeSwitch;
