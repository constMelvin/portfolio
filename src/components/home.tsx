import { BadgeCheck, ChevronRight, Download, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import {
	AffiliationItem,
	CertificateCard,
	PostRow,
	ProjectCard,
	RecommendationCard,
	Section,
	Timeline,
} from "./blocks";
import EmailCard from "./email-card";
import GazePhoto from "./gaze-photo";
import GithubGraph from "./github-graph";
import { useOverlay, type Overlay } from "@/lib/overlays";
import githubActivity from "../../public/github-activity.json";
import {
	affiliations,
	certificates,
	credentials,
	education,
	experience,
	posts,
	profile,
	projects,
	recommendations,
	socials,
	stack,
} from "@/data/portfolio";

const liveApps = projects.filter((p) => p.href).length;
// Counted from the earliest year on the experience timeline (2025 -> "1+ yrs" in 2026)
const firstYear = Math.min(...experience.map((e) => Number(e.period.match(/\d{4}/)?.[0] ?? Infinity)));
const yearsExperience = Math.max(1, new Date().getFullYear() - firstYear);
// Rounded down to the nearest 10, e.g. 384 -> "380+"
const contributions = `${Math.floor(githubActivity.total / 10) * 10}+`;

const stats: { value: string; label: string; to?: string; overlay?: Overlay }[] = [
	{ value: `${liveApps} live`, label: "apps shipped", to: "/projects" },
	{ value: contributions, label: "contributions", to: "/#github" },
	{ value: `${yearsExperience}+ yrs`, label: "experience", to: "/experience" },
];

// Section order drives the "01 — …" numbering
const order = [
	"blog",
	"projects",
	"experience",
	"education",
	"stack",
	"certifications",
	"recommendations",
	"affiliations",
	"github",
	"contact",
];
const num = (id: string) => order.indexOf(id) + 1;

// Fade-up entrance for the hero (see .reveal in index.css), staggered by `step`
const reveal = (step: number) => ({
	style: { "--d": step } as React.CSSProperties,
});

const Home = () => {
	const { setOpen } = useOverlay();

	return (
		<div className="mx-auto max-w-2xl px-6">
			{/* Hero */}
			<section className="relative pt-20 pb-16 sm:pt-28">
				<div className="grid gap-9 sm:grid-cols-[13rem_1fr] sm:items-start sm:gap-10">
					<div {...reveal(1)} className="reveal mx-auto w-full max-w-[13rem] sm:mx-0">
						<GazePhoto />
					</div>

					<div>
						<h1 data-guide="name" {...reveal(2)} className="reveal font-pixel text-3xl leading-tight sm:text-[2rem]">
							{profile.name}
							<BadgeCheck className="ml-2 inline-block size-6 fill-blue-500 align-[-0.15em] text-paper" />
						</h1>

						<p {...reveal(3)} className="reveal mt-4 font-mono text-[11px] uppercase tracking-wider text-gray-500">
							{profile.role} · {profile.location}
						</p>

						{profile.bio.slice(0, 2).map((p, i) => (
							<p key={p} {...reveal(4 + i)} className="reveal mt-5 text-[15px] leading-relaxed text-gray-600">
								{p}
							</p>
						))}

						<div
							data-guide="socials"
							{...reveal(6)}
							className="reveal mt-7 flex w-fit flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[12px] text-gray-500"
						>
							{socials.map((s) => (
								<a key={s.label} href={s.href} target="_blank" rel="noopener" className="hover:text-ink">
									{s.label.toLowerCase()} ↗
								</a>
							))}
						</div>

						<div {...reveal(7)} className="reveal mt-7 flex flex-wrap gap-2">
							<button
								type="button"
								onClick={() => setOpen("email")}
								className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-opacity hover:opacity-85"
							>
								<Mail className="size-3.5" /> Send email
							</button>
							<a
								href={profile.cv}
								download
								className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-paper px-4 py-2 text-[13px] font-medium text-ink transition-colors hover:border-ink"
							>
								<Download className="size-3.5" /> Download CV
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* Credentials strip */}
			<section aria-label="Credentials" className="border-t border-gray-200 py-5">
				<div className="grid grid-cols-3 divide-x divide-gray-200">
					{credentials.map(({ icon: Icon, title, detail }, i) => (
						<div
							key={title}
							className={
								"flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3 " +
								(i === 0 ? "pr-3 sm:pr-5" : i === credentials.length - 1 ? "pl-3 sm:pl-5" : "px-3 sm:px-5")
							}
						>
							<span className="flex h-8 shrink-0 items-center">
								<Icon className="size-5 text-ink" />
							</span>
							<span className="min-w-0 font-mono leading-tight">
								<span className="block text-[12px] font-semibold">{title}</span>
								<span className="mt-1 block whitespace-nowrap text-[9px] uppercase tracking-wider text-gray-500 sm:text-[10px]">
									{detail}
								</span>
							</span>
						</div>
					))}
				</div>
			</section>

			{/* Stats */}
			<section data-guide="stats" className="grid grid-cols-3 divide-x divide-gray-200 border-y border-gray-200">
				{stats.map((s, i) => {
					const content = (
						<>
							<div className="flex items-center gap-1">
								<span className="font-pixel text-lg leading-none">{s.value}</span>
								<ChevronRight className="size-3.5 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
							</div>
							<div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-gray-500 group-hover:text-ink">
								{s.label}
							</div>
						</>
					);
					return (
						<div key={s.label} className={i === 0 ? "py-6 pr-3 sm:pr-5" : "py-6 px-3 sm:px-5"}>
							{s.overlay ? (
								<button type="button" onClick={() => setOpen(s.overlay!)} className="group block cursor-pointer text-left">
									{content}
								</button>
							) : (
								<Link to={s.to!} className="group block">
									{content}
								</Link>
							)}
						</div>
					);
				})}
			</section>

			<Section id="blog" index={num("blog")} title="blog" more={{ to: "/blog", label: "all posts" }}>
				<div
					aria-hidden="true"
					className="halftone mask-circle pointer-events-none absolute bottom-6 -left-10 size-32 opacity-20"
				/>
				<div className="divide-y divide-gray-200 border-y border-gray-200">
					{posts.slice(0, 3).map((post) => (
						<PostRow key={post.title} post={post} />
					))}
				</div>
			</Section>

			<Section id="projects" index={num("projects")} title="projects" more={{ to: "/projects", label: "all projects" }}>
				<div className="grid gap-3 sm:grid-cols-2">
					{projects.slice(0, 4).map((project) => (
						<ProjectCard key={project.name} project={project} />
					))}
				</div>
			</Section>

			<Section id="experience" index={num("experience")} title="experience" more={{ to: "/experience", label: "full history" }}>
				<Timeline items={experience} />
			</Section>

			<Section id="education" index={num("education")} title="education" more={{ to: "/education", label: "details" }}>
				<Timeline items={education} />
			</Section>

			<Section id="stack" index={num("stack")} title="stack" more={{ to: "/stack", label: "full stack" }}>
				<div className="space-y-5">
					{stack.map((group) => (
						<div key={group.group}>
							<h3 className="mb-2.5 font-mono text-[10px] uppercase tracking-wider text-gray-400">{group.group}</h3>
							<div className="flex flex-wrap gap-1.5">
								{group.items.map((tech) => (
									<span
										key={tech}
										className="rounded-md border border-gray-200 bg-paper px-2.5 py-1 font-mono text-[12px] text-gray-600 transition-colors hover:border-gray-400 hover:text-ink"
									>
										{tech}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</Section>

			<Section
				id="certifications"
				index={num("certifications")}
				title="certifications"
				more={{ to: "/certifications", label: "all certifications" }}
			>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					{certificates.slice(0, 3).map((cert, i) => (
						<CertificateCard key={`${cert.name}-${i}`} cert={cert} />
					))}
				</div>
			</Section>

			<Section
				id="recommendations"
				index={num("recommendations")}
				title="recommendations"
				more={{ to: "/recommendations", label: "all recommendations" }}
			>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					{recommendations.slice(0, 3).map((rec, i) => (
						<RecommendationCard key={i} rec={rec} />
					))}
				</div>
			</Section>

			<Section
				id="affiliations"
				index={num("affiliations")}
				title="affiliations"
				more={{ to: "/affiliations", label: "all affiliations" }}
			>
				<div className="flex flex-wrap items-center gap-x-8 gap-y-4">
					{affiliations.map((a) => (
						<AffiliationItem key={a.name} a={a} />
					))}
				</div>
			</Section>

			<Section
				id="github"
				index={num("github")}
				title="github"
				more={{ to: `https://github.com/${profile.github}`, label: `@${profile.github}` }}
			>
				<GithubGraph username={profile.github} />
			</Section>

			<Section id="contact" index={num("contact")} title="contact">
				<EmailCard />
			</Section>

			{/* Bottom halftone fade */}
			<div aria-hidden="true" className="halftone halftone-wide mask-fade-x mt-2 mb-16 h-10 w-full opacity-[0.15]" />
		</div>
	);
};

export default Home;
