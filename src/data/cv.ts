// Builds the CV content from the same data as the website, so the two never drift.
// `npm run cv` turns this into cv/John-Melvin-Domingo-CV.docx and the PDF behind
// the "Download CV" button; `npm run build` warns when they're out of date.
import { cvSkills, education, experience, profile, projects, socials, type TimelineItem } from "./portfolio.ts";

export type CvEntry = {
	title: string; // bold heading (left)
	right?: string; // location or year (right)
	subtitle?: string; // role / degree line (left)
	subtitleRight?: string; // dates (right)
	notes?: string[];
	bullets?: string[];
};

const linkedin = socials.find((s) => s.label === "LinkedIn" && s.href.startsWith("http"));

const timelineEntry = (e: TimelineItem): CvEntry => ({
	title: (e.org ?? e.detail).toUpperCase(),
	right: e.location,
	subtitle: e.title,
	subtitleRight: e.cvPeriod ?? e.period,
	notes: e.notes,
	bullets: e.cv === false ? undefined : (e.cv ?? (e.description ? [e.description] : undefined)),
});

export const cvData = () => ({
	name: profile.name.toUpperCase(),
	contact: [
		profile.location,
		profile.phone,
		profile.email,
		linkedin && linkedin.href.replace(/^https?:\/\/(www\.)?/, ""),
		`github.com/${profile.github}`,
	].filter(Boolean) as string[],
	education: education
		.filter((e) => e.cv !== false)
		.map((e) => ({ ...timelineEntry(e), bullets: undefined })),
	work: experience.filter((e) => e.kind === "work").map(timelineEntry),
	projects: projects
		.filter((p) => p.cv !== false)
		.map((p) => ({
			title: p.cvName ?? p.name.toUpperCase(),
			right: p.year,
			bullets: p.cv || [p.tagline],
		})),
	activities: experience.filter((e) => e.kind === "activity").map(timelineEntry),
	skills: cvSkills,
});

export type CvData = ReturnType<typeof cvData>;
