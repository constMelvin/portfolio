import { motion } from "framer-motion";
import { ArrowUpRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { cn, initials } from "@/lib/utils";
import type {
	Affiliation,
	Certificate,
	Post,
	Project,
	Recommendation,
	TimelineItem,
} from "@/data/portfolio";

// Shared building blocks for the home page sections and the full pages

// Blur-in on scroll, like the reference's .reveal-item
export const Reveal = ({ className, children }: { className?: string; children: React.ReactNode }) => (
	<motion.div
		className={className}
		initial={{ opacity: 0, filter: "blur(10px)" }}
		whileInView={{ opacity: 1, filter: "blur(0px)" }}
		viewport={{ once: true, margin: "-40px" }}
		transition={{ duration: 0.6, ease: "easeOut" }}
	>
		{children}
	</motion.div>
);

export const Section = ({
	id,
	index,
	title,
	more,
	children,
}: {
	id: string;
	index: number;
	title: string;
	more?: { to: string; label: string };
	children: React.ReactNode;
}) => (
	<motion.section
		id={id}
		className="relative scroll-mt-16 py-14"
		initial={{ opacity: 0, filter: "blur(10px)" }}
		whileInView={{ opacity: 1, filter: "blur(0px)" }}
		viewport={{ once: true, margin: "-60px" }}
		transition={{ duration: 0.6, ease: "easeOut" }}
	>
		<div className="mb-8 flex items-baseline justify-between">
			<h2 className="font-pixel text-sm text-gray-400">
				{String(index).padStart(2, "0")} — {title}
			</h2>
			{more && <MoreLink to={more.to}>{more.label} →</MoreLink>}
		</div>
		{children}
	</motion.section>
);

export const MoreLink = ({ to, children }: { to: string; children: React.ReactNode }) =>
	to.startsWith("http") ? (
		<a
			href={to}
			target="_blank"
			rel="noopener"
			className="font-mono text-[11px] uppercase tracking-wider text-gray-500 hover:text-ink"
		>
			{children}
		</a>
	) : (
		<Link to={to} className="font-mono text-[11px] uppercase tracking-wider text-gray-500 hover:text-ink">
			{children}
		</Link>
	);

// Page title + intro used at the top of every full page
export const PageHeader = ({ title, intro }: { title: string; intro: string }) => (
	<>
		<header className="mb-12">
			<h1 className="reveal font-pixel text-2xl leading-none">{title}</h1>
		</header>
		<p className="reveal mb-12 max-w-xl text-[15px] leading-relaxed text-gray-600" style={{ "--d": 1 } as React.CSSProperties}>
			{intro}
		</p>
	</>
);

export const Tag = ({ children, dashed }: { children: React.ReactNode; dashed?: boolean }) => (
	<span
		className={cn(
			"rounded-md px-2.5 py-1 font-mono text-[11px]",
			dashed ? "border border-dashed border-gray-300 text-gray-400" : "border border-gray-200 bg-paper text-gray-600"
		)}
	>
		{children}
	</span>
);

export const Pill = ({ children, solid }: { children: React.ReactNode; solid?: boolean }) => (
	<span
		className={cn(
			"rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider",
			solid ? "bg-ink text-paper" : "border border-gray-300 text-gray-500"
		)}
	>
		{children}
	</span>
);

// Compact year | title | detail rows (home page)
export const Timeline = ({ items }: { items: TimelineItem[] }) => (
	<div className="divide-y divide-gray-200 border-y border-gray-200">
		{items.map((item) => (
			<div
				key={item.title}
				className="grid grid-cols-12 items-baseline gap-3 py-2.5 transition-colors hover:bg-gray-50/80"
			>
				<div className="col-span-3 font-mono text-[11px] text-gray-400 sm:col-span-2">{item.period}</div>
				<div className="col-span-9 flex items-center gap-2 text-[14px] font-medium text-ink sm:col-span-5">
					{item.title}
					{item.current && <Pill solid>now</Pill>}
				</div>
				<div className="col-span-9 col-start-4 text-[13px] text-gray-500 sm:col-span-5 sm:col-start-auto sm:text-right">
					{item.detail}
				</div>
			</div>
		))}
	</div>
);

// Logo-rail timeline with descriptions and skills (full pages)
export const RailTimeline = ({ items }: { items: TimelineItem[] }) => (
	<div>
		{items.map((item, i) => (
			<Reveal key={item.title} className="relative flex gap-4 sm:gap-5">
				<div className="flex flex-col items-center">
					<div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-paper font-pixel text-[12px] text-ink">
						{initials(item.title)}
					</div>
					{i < items.length - 1 && <div className="mt-2 w-px flex-1 bg-gray-200" />}
				</div>
				<div className="flex-1 pb-12">
					<h2 className="flex flex-wrap items-center gap-2 text-[16px] font-semibold leading-snug text-ink">
						{item.title}
						{item.current && <Pill solid>now</Pill>}
					</h2>
					<p className="mt-1 font-mono text-[12px] text-gray-500">{item.detail}</p>
					<p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-gray-400">{item.period}</p>
					{item.description && (
						<p className="mt-3 text-[14px] leading-relaxed text-gray-600">{item.description}</p>
					)}
					{item.skills && (
						<div className="mt-4 flex flex-wrap gap-2">
							{item.skills.map((s) => (
								<Tag key={s}>{s}</Tag>
							))}
						</div>
					)}
				</div>
			</Reveal>
		))}
	</div>
);

// Browser-style frame around a project screenshot
const Preview = ({ src, alt, large }: { src: string; alt: string; large?: boolean }) => (
	<div className={cn("overflow-hidden border border-gray-200 bg-gray-100", large ? "rounded-xl" : "rounded-lg")}>
		<div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-2.5 py-1.5">
			{[0, 1, 2].map((d) => (
				<span key={d} className="size-1.5 rounded-full bg-gray-300" />
			))}
		</div>
		<div className="aspect-[16/10] overflow-hidden">
			<img
				src={src}
				alt={alt}
				loading="lazy"
				decoding="async"
				className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
			/>
		</div>
	</div>
);

export const ProjectCard = ({ project, large }: { project: Project; large?: boolean }) => (
	<article
		className={cn(
			"group relative flex flex-col rounded-2xl border border-gray-200 bg-paper transition hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-[0_18px_36px_-20px_rgba(10,10,10,0.35)]",
			large ? "p-6 sm:p-7" : "p-4"
		)}
	>
		{project.image && <Preview src={project.image} alt={`${project.name} preview`} large={large} />}
		<div className={cn("flex flex-col", project.image ? "mt-4" : "", !large && "px-1")}>
			<div className="flex items-start justify-between gap-2">
				{!project.image && (
					<div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 shadow-sm">
						<project.icon className="size-5 text-gray-700" />
					</div>
				)}
				{project.image && (
					<project.icon className="mt-0.5 size-4 shrink-0 text-gray-400" />
				)}
				{project.badge && <Pill solid>{project.badge}</Pill>}
			</div>
			<h3 className={cn("text-ink", large ? "mt-3 font-pixel text-xl leading-none" : "mt-3 text-[15px] font-medium")}>
				{project.href ? (
					// Stretched link: the whole card opens the live site
					<a
						href={project.href}
						target="_blank"
						rel="noopener"
						className="inline-flex items-center gap-1 after:absolute after:inset-0 after:rounded-2xl"
					>
						{project.name}
						<ArrowUpRight className="size-3.5 text-gray-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
					</a>
				) : (
					project.name
				)}
			</h3>
			<p className={cn("mt-2 leading-relaxed text-gray-600", large ? "max-w-lg text-[14px]" : "text-[13px]")}>
				{project.tagline}
			</p>
			<div className="mt-4 flex flex-wrap gap-1.5">
				{project.tags.map((tag) => (
					<Pill key={tag}>{tag}</Pill>
				))}
			</div>
			{project.href && (
				<div className="mt-4 border-t border-gray-100 pt-3 font-mono text-[11px] uppercase tracking-wider text-gray-500">
					{new URL(project.href).host} ↗
				</div>
			)}
		</div>
	</article>
);

export const CertificateCard = ({ cert }: { cert: Certificate }) => {
	const Card = cert.href ? "a" : "div";
	return (
		<Card
			{...(cert.href && { href: cert.href, target: "_blank", rel: "noopener" })}
			className="group relative flex flex-col items-center rounded-xl bg-gradient-to-b from-gray-50 to-paper px-4 py-5 text-center shadow-[0_8px_22px_-14px_rgba(10,10,10,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-20px_rgba(10,10,10,0.4)]"
		>
			<span aria-hidden="true" className="pointer-events-none absolute inset-[5px] rounded-lg border border-gray-200/70" />
			<span className="relative flex size-9 items-center justify-center rounded-md border border-gray-200 bg-paper font-pixel text-sm">
				{cert.issuer.charAt(0)}
			</span>
			<h3 className="relative mt-3 text-[13px] font-semibold leading-snug text-ink">{cert.name}</h3>
			<p className="relative mt-1 font-mono text-[9.5px] uppercase tracking-wider text-gray-400">
				{cert.issuer} · {cert.year}
			</p>
			<span className="relative mt-auto flex items-center gap-1.5 pt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-gray-300 group-hover:text-ink">
				verify <ArrowUpRight className="size-3" />
			</span>
		</Card>
	);
};

export const RecommendationCard = ({ rec, full }: { rec: Recommendation; full?: boolean }) => (
	<figure className="group flex flex-col rounded-xl bg-gradient-to-b from-gray-50 to-paper p-5 shadow-[0_8px_22px_-16px_rgba(10,10,10,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-20px_rgba(10,10,10,0.35)]">
		<Quote className="size-5 fill-gray-200 text-gray-200" />
		<blockquote className={cn("mt-2 text-[13.5px] leading-relaxed text-gray-700", !full && "line-clamp-5")}>
			{rec.quote}
		</blockquote>
		<figcaption className="mt-auto flex items-center gap-2.5 border-t border-gray-100 pt-3">
			<span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 font-mono text-[10px] font-medium text-gray-600">
				{initials(rec.name)}
			</span>
			<span className="min-w-0">
				<span className="block truncate text-[12px] font-semibold text-ink">{rec.name}</span>
				<span className="block truncate font-mono text-[9px] uppercase tracking-wider text-gray-400">{rec.title}</span>
			</span>
		</figcaption>
	</figure>
);

export const AffiliationItem = ({ a }: { a: Affiliation }) => (
	<div className="inline-flex items-center gap-3">
		<span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-paper text-[18px] leading-none">
			{a.logo ? <img src={a.logo} alt="" className="size-full object-contain p-1.5" /> : a.emoji}
		</span>
		<span>
			<span className="block text-[13px] font-medium leading-snug text-ink">{a.name}</span>
			<span className="block font-mono text-[10px] uppercase tracking-wider text-gray-400">{a.role}</span>
		</span>
	</div>
);

export const PostRow = ({ post }: { post: Post }) => (
	<a
		href={post.href}
		className="group flex items-baseline justify-between gap-6 py-5 transition-colors hover:bg-gray-50/80"
	>
		<div className="min-w-0">
			<h3 className="truncate text-[15px] font-medium text-ink group-hover:text-gray-500">{post.title}</h3>
			<p className="mt-1 truncate text-sm text-gray-500">{post.summary}</p>
		</div>
		<time className="shrink-0 font-mono text-[12px] text-gray-400">{post.date}</time>
	</a>
);
