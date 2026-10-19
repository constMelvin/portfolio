import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type Data = { lastYear: Day[]; byYear: Record<string, Day[]> };

const API = "https://github-contributions-api.jogruber.de/v4";
const CELL = 10;
const GAP = 2;
const STEP = CELL + GAP;
const LEFT = 28; // room for the Mon / Wed / Fri labels
const TOP = 18; // room for the month labels
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS: Record<number, string> = { 1: "Mon", 3: "Wed", 5: "Fri" };

// GitHub's own contribution greens (--gh-* in index.css, light and dark variants)
const LEVEL_CLASS = [
	"fill-[var(--gh-0)]",
	"fill-[var(--gh-1)]",
	"fill-[var(--gh-2)]",
	"fill-[var(--gh-3)]",
	"fill-[var(--gh-4)]",
];

const parse = (date: string) => new Date(`${date}T00:00:00`);

const ordinal = (n: number) => {
	const s = ["th", "st", "nd", "rd"];
	const v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// "3 contributions on October 5th." — GitHub's tooltip wording
const tooltip = (day: Day) => {
	const d = parse(day.date);
	const when = `${d.toLocaleString("en-US", { month: "long" })} ${ordinal(d.getDate())}`;
	return `${day.count === 0 ? "No" : day.count} contribution${day.count === 1 ? "" : "s"} on ${when}.`;
};

const fetchJson = (url: string) => fetch(url).then((res) => (res.ok ? res.json() : Promise.reject(res.status)));

// Snapshot of private + public activity from `npm run github:sync` (missing file is fine)
const fetchSnapshot = (): Promise<Record<string, number>> =>
	fetch("/github-activity.json")
		.then((res) => (res.ok ? res.json() : { days: {} }))
		.then((json: { days?: Record<string, number> }) => json.days ?? {})
		.catch(() => ({}));

// Take the higher count per day from the live API and the snapshot, then recompute
// levels the way GitHub does: quartiles of the busy days in the range
const merge = (days: Day[], snapshot: Record<string, number>): Day[] => {
	const merged = days.map((d) => ({ ...d, count: Math.max(d.count, snapshot[d.date] ?? 0) }));
	const busy = merged.map((d) => d.count).filter(Boolean).sort((a, b) => a - b);
	const q = (p: number) => busy[Math.min(busy.length - 1, Math.floor(p * busy.length))] ?? 0;
	const [q1, q2, q3] = [q(0.25), q(0.5), q(0.75)];
	return merged.map((d) => ({
		...d,
		level: !d.count ? 0 : d.count <= q1 ? 1 : d.count <= q2 ? 2 : d.count <= q3 ? 3 : 4,
	}));
};

const GithubGraph = ({ username }: { username: string }) => {
	const [data, setData] = useState<Data | null>(null);
	const [failed, setFailed] = useState(false);
	const [year, setYear] = useState<string | null>(null); // null = last 12 months

	useEffect(() => {
		let cancelled = false;
		Promise.all([
			fetchJson(`${API}/${username}?y=last`),
			fetchJson(`${API}/${username}?y=all`),
			fetchSnapshot(),
		])
			.then(([last, all, snapshot]: [{ contributions: Day[] }, { contributions: Day[] }, Record<string, number>]) => {
				if (cancelled) return;
				const byYear: Record<string, Day[]> = {};
				for (const day of all.contributions) (byYear[day.date.slice(0, 4)] ??= []).push(day);
				for (const y of Object.keys(byYear)) byYear[y] = merge(byYear[y], snapshot);
				setData({ lastYear: merge(last.contributions, snapshot), byYear });
			})
			.catch(() => !cancelled && setFailed(true));
		return () => {
			cancelled = true;
		};
	}, [username]);

	if (failed) {
		return (
			<p className="font-mono text-[11px] uppercase tracking-wider text-gray-400">
				couldn't load contributions — see github.com/{username}
			</p>
		);
	}

	const years = data ? Object.keys(data.byYear).sort().reverse() : [String(new Date().getFullYear())];
	const days = data ? (year ? data.byYear[year] : data.lastYear) : null;
	const total = days?.reduce((sum, d) => sum + d.count, 0) ?? 0;

	// Pad the start so the first column begins on Sunday, then split into weeks
	const padded: (Day | null)[] = days
		? [...Array(parse(days[0].date).getDay()).fill(null), ...days]
		: Array(371).fill(null);
	const weeks: (Day | null)[][] = [];
	for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));

	// Label a month on the first week that contains its 1st day
	const monthLabels = weeks.flatMap((week, w) => {
		const first = week.find((d) => d && parse(d.date).getDate() === 1);
		return first && w < weeks.length - 1 ? [{ w, label: MONTHS[parse(first.date).getMonth()] }] : [];
	});

	const width = LEFT + weeks.length * STEP;
	const height = TOP + 7 * STEP;

	return (
		<div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-start">
			<div className="min-w-0 flex-1">
				<h3 className="mb-2 text-[15px] text-ink">
					{days ? `${total.toLocaleString()} contributions in ${year ?? "the last year"}` : "Loading contributions…"}
				</h3>

				<div className="rounded-md border border-gray-200 px-3 pt-3 pb-2.5">
					<a
						href={`https://github.com/${username}`}
						target="_blank"
						rel="noopener"
						className="block overflow-x-auto [scrollbar-width:thin]"
					>
						<svg
							viewBox={`0 0 ${width} ${height}`}
							className="w-full min-w-[620px] sm:min-w-0"
							role="img"
							aria-label={`${total} GitHub contributions in ${year ?? "the last year"}`}
						>
							{monthLabels.map(({ w, label }) => (
								<text key={w} x={LEFT + w * STEP} y={11} className="fill-ink text-[10px]">
									{label}
								</text>
							))}
							{Object.entries(DAY_LABELS).map(([row, label]) => (
								<text key={row} x={0} y={TOP + Number(row) * STEP + 8.5} className="fill-ink text-[10px]">
									{label}
								</text>
							))}
							{weeks.map((week, w) =>
								week.map((day, d) =>
									day || !days ? (
										<rect
											key={`${w}-${d}`}
											x={LEFT + w * STEP}
											y={TOP + d * STEP}
											width={CELL}
											height={CELL}
											rx={2}
											className={cn(
												"stroke-[var(--gh-stroke)] [stroke-width:1px]",
												day ? LEVEL_CLASS[day.level] : "animate-pulse fill-[var(--gh-0)]"
											)}
										>
											{day && <title>{tooltip(day)}</title>}
										</rect>
									) : null
								)
							)}
						</svg>
					</a>

					<div className="mt-2 flex items-center justify-between gap-4 text-[11px] text-gray-500">
						<a
							href="https://docs.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile"
							target="_blank"
							rel="noopener"
							className="hover:text-[#0969da] dark:hover:text-[#4493f8]"
						>
							Learn how we count contributions
						</a>
						<span className="flex items-center gap-1">
							Less
							{LEVEL_CLASS.map((c) => (
								<svg key={c} width={10} height={10} aria-hidden="true">
									<rect width={10} height={10} rx={2} className={cn(c, "stroke-[var(--gh-stroke)]")} />
								</svg>
							))}
							More
						</span>
					</div>
				</div>
			</div>

			{/* Year switcher, like the list to the right of GitHub's graph */}
			<div className="flex gap-1.5 sm:w-16 sm:shrink-0 sm:flex-col sm:pt-7">
				{years.map((y) => {
					const active = year === y || (year === null && y === years[0]);
					return (
						<button
							key={y}
							type="button"
							onClick={() => setYear(year === y ? null : y)}
							className={cn(
								"cursor-pointer rounded-md px-2.5 py-1.5 text-left text-[12px] transition-colors",
								active
									? "bg-[#0969da] text-white dark:bg-[#1f6feb]"
									: "text-gray-500 hover:bg-gray-100 hover:text-ink"
							)}
						>
							{y}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default GithubGraph;
