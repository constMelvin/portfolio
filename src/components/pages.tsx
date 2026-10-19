import { cn } from "@/lib/utils";
import {
	AffiliationItem,
	CertificateCard,
	PageHeader,
	PostRow,
	ProjectCard,
	RailTimeline,
	RecommendationCard,
	Reveal,
} from "./blocks";
import {
	affiliations,
	certificates,
	education,
	experience,
	posts,
	projects,
	recommendations,
	stack,
} from "@/data/portfolio";

// Full pages opened from the sidebar, laid out like the reference's subpages

const Page = ({ width = "max-w-2xl", children }: { width?: string; children: React.ReactNode }) => (
	<div className={cn("relative z-10 mx-auto px-6 py-14 sm:py-20", width)}>{children}</div>
);

export const ProjectsPage = () => {
	const featured = projects.filter((p) => p.image && p.href);
	const others = projects.filter((p) => !(p.image && p.href));
	return (
		<Page width="max-w-3xl">
			<PageHeader
				title="projects"
				intro="Products I've designed and shipped — full-stack web platforms, mobile apps and tools, built with Spring Boot, React, React Native and more."
			/>
			<div className="mb-10 space-y-5">
				{featured.map((p) => (
					<Reveal key={p.name}>
						<ProjectCard project={p} large />
					</Reveal>
				))}
			</div>
			<h2 className="mb-5 font-mono text-[11px] uppercase tracking-wider text-gray-400">More projects</h2>
			<div className="grid gap-3 sm:grid-cols-2">
				{others.map((p) => (
					<Reveal key={p.name}>
						<ProjectCard project={p} />
					</Reveal>
				))}
			</div>
		</Page>
	);
};

export const ExperiencePage = () => (
	<Page>
		<PageHeader
			title="experience"
			intro="From my first system development project in 2025 to a full-stack OJT and a thesis — building web, mobile and hardware projects along the way."
		/>
		<RailTimeline items={experience} />
	</Page>
);

export const EducationPage = () => (
	<Page>
		<PageHeader title="education" intro="Where I've studied — currently taking Computer Engineering at Bulacan State University." />
		<RailTimeline items={education} />
	</Page>
);

export const StackPage = () => (
	<Page width="max-w-3xl">
		<PageHeader
			title="tech stack"
			intro="The languages, frameworks and platforms I reach for — across the front end, mobile, back end, databases and deployment."
		/>
		<div className="space-y-10">
			{stack.map((group) => (
				<Reveal key={group.group}>
					<section>
						<h2 className="mb-4 font-mono text-[11px] uppercase tracking-wider text-gray-400">{group.group}</h2>
						<div className="flex flex-wrap gap-2">
							{group.items.map((t) => (
								<span
									key={t}
									className="rounded-md border border-gray-200 bg-paper px-3 py-1.5 font-mono text-[13px] text-gray-700 transition-colors hover:border-gray-400 hover:text-ink"
								>
									{t}
								</span>
							))}
						</div>
					</section>
				</Reveal>
			))}
		</div>
	</Page>
);

export const CertificationsPage = () => (
	<Page width="max-w-4xl">
		<PageHeader title="certifications" intro="Courses and credentials I've completed — each verifiable at its source." />
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
			{certificates.map((c, i) => (
				<Reveal key={`${c.name}-${i}`} className="flex">
					<CertificateCard cert={c} />
				</Reveal>
			))}
		</div>
	</Page>
);

export const RecommendationsPage = () => (
	<Page width="max-w-3xl">
		<PageHeader title="recommendations" intro="What professors, teammates and collaborators say about working with me." />
		<div className="grid gap-3 sm:grid-cols-2">
			{recommendations.map((r, i) => (
				<Reveal key={i} className="flex">
					<RecommendationCard rec={r} full />
				</Reveal>
			))}
		</div>
	</Page>
);

export const AffiliationsPage = () => (
	<Page>
		<PageHeader title="affiliations" intro="Organizations and communities I'm part of." />
		<div className="divide-y divide-gray-200 border-y border-gray-200">
			{affiliations.map((a) => (
				<Reveal key={a.name} className="py-4">
					<AffiliationItem a={a} />
				</Reveal>
			))}
		</div>
	</Page>
);

export const BlogPage = () => (
	<Page>
		<PageHeader title="blog" intro="Notes on what I'm building and learning." />
		<div className="divide-y divide-gray-200 border-y border-gray-200">
			{posts.map((p) => (
				<PostRow key={p.title} post={p} />
			))}
		</div>
	</Page>
);

export const NotFoundPage = () => (
	<Page>
		<PageHeader title="404" intro="This page doesn't exist — use the sidebar to find your way back." />
	</Page>
);
