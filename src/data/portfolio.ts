// All portfolio content lives here so the page components stay layout-only.
// Replace the placeholder values (marked TODO) with your real info.

import {
  BriefcaseBusiness,
  Car,
  Fish,
  Globe,
  GraduationCap,
  MapPin,
  Radio,
  Sailboat,
  School,
  Stethoscope,
  Truck,
  type LucideIcon,
} from "lucide-react";

export const profile = {
  name: "John Melvin Domingo",
  shortName: "JM Domingo",
  role: "Software / Web Developer",
  location: "Bulacan, Philippines",
  photo: "/jm-formal.png",
  email: "domingo.jm029@gmail.com",
  phone: "09912183153", // optional — shown on the CV header when filled, e.g. "+63 9XX XXX XXXX"
  // Generated from this file by `npm run cv` (see src/data/cv.ts)
  cv: "/John-Melvin-Domingo-CV.pdf",
  startedCoding: 2021,
  github: "constMelvin", // used for the contributions graph
  bio: [
    "I'm a Computer Engineering student and full-stack developer who builds web and mobile apps end to end — from the interface people use to the APIs, databases and cloud setup behind it.",
    "I like turning messy, real-world problems into simple, reliable systems — a real-time supply chain platform, a school attendance app with QR scanning, or an Arduino project on my desk — and I care about clean code that holds up in production.",
    "I'm always learning and shipping, picking up whatever the problem needs, from Spring Boot and React to AWS and microcontrollers.",
  ],
};

export const socials = [
  { label: "GitHub", href: "https://github.com/constMelvin" },
  { label: "LinkedIn", href: "#" }, // TODO: your profile URLs

  { label: "Instagram", href: "https://www.instagram.com/melvnnn._" },
];

// Small badge strip shown under the hero
export const credentials: {
  icon: LucideIcon;
  title: string;
  detail: string;
}[] = [
  { icon: GraduationCap, title: "BulSU", detail: "CpE student" },
  { icon: BriefcaseBusiness, title: "Open to work", detail: "Internships" },
  { icon: MapPin, title: "Bulacan", detail: "PH · GMT+8" },
];

// Based on the dependencies used across github.com/constMelvin repos
// "Additional" section of the CV — keep in step with `stack` below
export const cvSkills: { label: string; text: string }[] = [
  {
    label: "Technical Skills",
    text: "Proficient in Java, Spring Boot, TypeScript/JavaScript, React, Next.js, React Native (Expo), PostgreSQL, MySQL; Familiar with Node.js, Bun, Hono, Go, Python, C/C++, Redis, Supabase, Docker, Nginx, AWS, GitHub Actions",
  },
  {
    label: "Hardware",
    text: "Arduino, ESP32, sensors, relays, LCD displays, motors  ·  Languages: English, Filipino (native)",
  },
];

export const stack: { group: string; items: string[] }[] = [
  {
    group: "Frontend",
    items: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Vite",
      "Tailwind CSS",
      "shadcn/ui",
      "TanStack Query",
      "TanStack Router",
      "Zustand",
      "React Hook Form",
      "Zod",
      "HTML",
      "CSS",
    ],
  },
  {
    group: "Mobile",
    items: ["React Native", "Expo", "Expo Router", "Firebase Cloud Messaging"],
  },
  {
    group: "Backend",
    items: [
      "Java",
      "Spring Boot",
      "Node.js",
      "Bun",
      "Hono",
      "Express",
      "Go",
      "Python",
      "C++",
      "REST APIs",
      "WebSockets (STOMP)",
      "JWT",
      "Better Auth",
    ],
  },
  {
    group: "Hardware & Embedded",
    items: [
      "Arduino",
      "ESP32",
      "Embedded C/C++",
      "IoT",
      "Sensors",
      "Relays",
      "LCD Displays",
      "Motors",
      "Circuit Prototyping",
    ],
  },
  {
    group: "Database",
    items: [
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Supabase",
      "Drizzle ORM",
      "Flyway",
    ],
  },
  {
    group: "Cloud & DevOps",
    items: [
      "AWS",
      "Docker",
      "Nginx",
      "GitHub Actions",
      "Vercel",
      "Railway",
      "Render",
    ],
  },
  {
    group: "Testing & Tools",
    items: [
      "Vitest",
      "Playwright",
      "Testcontainers",
      "Git",
      "GitHub",
      "VS Code",
      "Postman",
    ],
  },
];

export type TimelineItem = {
  period: string;
  title: string;
  detail: string;
  current?: boolean;
  // Shown on the full /experience and /education pages
  description?: string;
  skills?: string[];
  // CV only (src/data/cv.ts): which section it lands in, plus header details
  kind?: "work" | "activity";
  org?: string;
  location?: string;
  cvPeriod?: string; // defaults to `period`
  notes?: string[]; // plain lines under the heading
  cv?: string[] | false; // bullets (defaults to `description`), or false to leave it off
};

export const experience: TimelineItem[] = [
  {
    period: "2026",
    title: "Thesis — Pickleball Livestreaming Platform",
    detail: "BulSU Computer Engineering · software + hardware",
    current: true,
    // TODO: add the stack, the hardware used and your role on the team
    description:
      "Our Computer Engineering thesis: a platform for livestreaming pickleball matches, combining a full-stack web app with custom hardware.",
  },
  {
    period: "2026",
    title: "On The Water",
    detail: "Collaborative trip planner · web + mobile",
    description:
      "Building a collaborative trip planner end to end — a Spring Boot API with Redis caching, a Next.js web app and an Expo mobile app, with live updates over Supabase Realtime and photo uploads to Google Drive.",
    skills: [
      "Spring Boot",
      "Next.js",
      "Expo",
      "Supabase",
      "Redis",
      "PostgreSQL",
    ],
  },
  {
    period: "2026",
    title: "Full-stack Developer (OJT)",
    detail: "Paradigma International · Binondo",
    kind: "work",
    org: "Paradigma International",
    location: "Binondo, Manila",
    cvPeriod: "Summer 2026",
    cv: [
      "Developed features for SCMS (scms.para-on.com), ParaOn’s supply chain management system covering procurement, inbound shipments, FEFO warehouse inventory, distribution and POS",
      "Built across the React front end and Java backend, including real-time updates over WebSockets",
      "Set up and configured the AWS environment the application runs on",
    ],
    description:
      "Summer OJT (2+ months) as one of the full-stack developers of SCMS, ParaOn's supply chain management system — building features across the React front end and Java backend, real-time updates over WebSockets, and setting up its AWS environment.",
    skills: ["Java", "React", "WebSockets", "AWS", "Cloud Setup"],
  },
  {
    period: "2025",
    title: "System Development Project",
    detail: "Parking app inspired by Parkable",
    description:
      "Designed and built a parking reservation system inspired by Parkable for our system development course — database, API and UI.",
    skills: ["React", "Node.js", "MySQL"],
  },
  {
    period: "2025",
    title: "Hardware & IoT Projects",
    detail: "BulSU CpE school projects & activities",
    kind: "activity",
    org: "Bulacan State University – Computer Engineering",
    location: "Bulacan",
    cv: [
      "Built Arduino and ESP32 projects for classes and school activities — sensors, relays, LCD displays and motors, including an Arduino-controlled water pump",
    ],
    description:
      "Arduino and ESP32 projects for Computer Engineering classes and school activities — wiring sensors, relays, LCD displays and motors, including an Arduino-controlled water pump and a two-board aquaponics water quality monitor (pH, TDS, temperature and ultrasonic water level).",
    skills: ["Arduino", "ESP32", "Embedded C/C++", "IoT", "Sensors", "I²C"],
  },
];

export const education: TimelineItem[] = [
  {
    period: "2023 — now",
    title: "BS Computer Engineering",
    detail: "Bulacan State University — Meneses",
    current: true,
    org: "Bulacan State University – Meneses Campus",
    location: "Bulacan",
    cvPeriod: "2023 – Present",
    notes: [
      "Thesis (in progress): Pickleball livestreaming platform combining a full-stack web app with custom hardware",
    ],
    description:
      "Studying hardware, software and systems design while building full-stack projects on the side.",
  },
  {
    period: "2021 — 22",
    title: "BS Information Technology",
    detail: "ACLC College — Baliuag",
    org: "ACLC College – Baliuag",
    location: "Bulacan",
    cvPeriod: "2021 – 2022",
  },
  {
    period: "2019 — 21",
    title: "TVL — ICT (Senior High)",
    detail: "San Miguel National High School",
    cv: false, // keeps the CV to one page
  },
];

export type Project = {
  name: string;
  tagline: string;
  tags: string[];
  icon: LucideIcon;
  href?: string; // live site
  image?: string; // preview screenshot in /public/projects
  // Highlighted pill, e.g. "In progress" or an award
  badge?: string;
  // CV only (src/data/cv.ts)
  year?: string;
  cvName?: string; // defaults to the upper-cased name
  cv?: string[] | false; // bullets (defaults to `tagline`), or false to leave it off
};

export const projects: Project[] = [
  {
    name: "SCMS — Supply Chain Management System",
    image: "/projects/scms.webp",
    icon: Truck,
    tagline:
      "ParaOn's supply chain platform — supplier catalogs and purchase orders, inbound shipments, FEFO warehouse inventory, distribution and POS in one system, with real-time updates over WebSockets. Built at Paradigma International as one of the developers, including the AWS setup.",
    tags: ["Java", "React", "WebSockets", "Tailwind CSS", "Recharts", "AWS"],
    href: "https://scms.para-on.com",
    badge: "Team · Paradigma",
    cv: false, // on the CV under Work Experience (OJT)
  },
  {
    name: "Student Management System",
    image: "/projects/student-management.webp",
    icon: School,
    tagline:
      "Web + mobile platform for student records, QR-code attendance, learning materials and real-time chat, with role-based access for admins, teachers, officers and students.",
    tags: [
      "Spring Boot",
      "Java",
      "React",
      "React Native",
      "MySQL",
      "WebSockets",
    ],
    href: "https://student-management.vinnn.app",
    badge: "Web + Mobile",
    year: "2026",
    cvName: "STUDENT MANAGEMENT SYSTEM (Web + Mobile)",
    cv: [
      "Spring Boot / Java 17 REST API with JWT auth, role-based access for five roles, MySQL and STOMP WebSockets for real-time chat",
      "React web app and React Native (Expo) app with camera QR attendance scanning and Firebase push notifications",
    ],
  },
  {
    name: "On The Water",
    image: "/projects/on-the-water.webp",
    icon: Sailboat,
    tagline:
      "Collaborative trip planner — RSVPs, itinerary map, shared checklist, budget splits, live location, photo dump and chat, synced live for every member.",
    tags: ["Spring Boot", "Next.js", "Expo", "Supabase", "Redis", "PostgreSQL"],
    href: "https://otw.vinnn.app",
    badge: "Web + Mobile",
    year: "2026",
    cvName: "ON THE WATER (Web + Mobile)",
    cv: [
      "Collaborative trip planner (otw.vinnn.app) — Spring Boot 4 / Java 21 API with Flyway migrations and Redis caching on Supabase Postgres, Auth and Realtime",
      "Next.js web app and Expo mobile app with live updates, map itineraries, budget splits and Google Drive photo uploads",
    ],
  },
  {
    name: "RN-Reviewer",
    image: "/projects/rn-reviewer.webp",
    icon: Stethoscope,
    tagline:
      "Study hub for the Philippine Nursing Licensure Exam — topic reviewer, task and score trackers, and a daily agenda, with email or Google sign-in.",
    tags: ["React", "TanStack", "Bun", "Hono", "Drizzle", "PostgreSQL"],
    href: "https://rn-reviewer.vinnn.app",
    badge: "Live",
    year: "2026",
    cv: [
      "Study platform for the Philippine Nursing Licensure Exam — React + TanStack client, Bun + Hono API with Drizzle ORM and PostgreSQL, Better Auth sign-in (email and Google)",
    ],
  },
  {
    name: "Pickleball Livestreaming Platform",
    icon: Radio,
    tagline:
      "Thesis project — livestreaming pickleball matches with a full-stack web platform and custom hardware.",
    tags: ["Thesis", "Livestreaming", "Hardware", "Full-stack"], // TODO: swap for the real stack
    badge: "Thesis · In progress",
    cv: false, // on the CV under Education (thesis note)
  },
  {
    name: "Aquaponics Water Quality Monitor",
    icon: Fish,
    tagline:
      "Two-Arduino monitor for a tilapia and pechay aquaponics tank: pH, TDS, water temperature and ultrasonic water level on a 20x4 LCD, with LED and buzzer alarms tuned for the fish and plants. A wave filter steadies the level reading against pump ripples, and every sensor is calibrated over serial and saved in EEPROM.",
    tags: ["Arduino", "C++", "Sensors", "I²C", "EEPROM", "IoT"],
    badge: "Hardware",
    year: "2026",
    cv: false, // keeps the CV to one page; covered by Hardware & IoT Projects
  },
  {
    name: "Parking System",
    icon: Car,
    tagline: "Find and reserve parking slots, inspired by Parkable.",
    tags: ["React", "Node.js", "MySQL"],
    year: "2025",
    cvName: "PARKING RESERVATION SYSTEM",
    cv: [
      "System development course project inspired by Parkable — designed the database, API and UI with React, Node.js and MySQL",
    ],
    badge: "In progress",
  },
  {
    name: "Portfolio",
    image: "/projects/portfolio.webp",
    icon: Globe,
    tagline: "This site — React, Tailwind CSS and Framer Motion.",
    tags: ["React", "TypeScript", "Tailwind"],
    cv: false,
  },
];

export type Certificate = {
  name: string;
  issuer: string;
  year: string;
  href?: string;
};

// TODO: replace with your real certificates
export const certificates: Certificate[] = [
  { name: "Certificate name", issuer: "Issuer", year: "2025" },
  { name: "Certificate name", issuer: "Issuer", year: "2024" },
  { name: "Certificate name", issuer: "Issuer", year: "2024" },
];

export type Recommendation = {
  quote: string;
  name: string;
  title: string;
};

// TODO: replace with real recommendations from professors, mentors or teammates
export const recommendations: Recommendation[] = [
  {
    quote:
      "Add a short recommendation here — what it was like to work or study with you, in their words.",
    name: "Name Surname",
    title: "Professor, Bulacan State University",
  },
  {
    quote:
      "Ask a teammate from a school project or hackathon for one or two sentences about your work.",
    name: "Name Surname",
    title: "Teammate, Capstone Project",
  },
  {
    quote: "A mentor, client or OJT supervisor quote works great here too.",
    name: "Name Surname",
    title: "Supervisor, Company",
  },
];

export type Post = {
  title: string;
  summary: string;
  date: string;
  href: string;
};

// TODO: link your blog posts (dev.to, Medium, Hashnode, LinkedIn articles…)
export const posts: Post[] = [
  {
    title: "Building a parking system as a student",
    summary:
      "What I learned designing the database, API and UI for my system development project.",
    date: "2025",
    href: "#",
  },
  {
    title: "From Hello World to full-stack",
    summary:
      "My path from YouTube tutorials in 2021 to building MERN and PERN apps.",
    date: "2024",
    href: "#",
  },
  {
    title: "Post title",
    summary: "One-line summary of the post.",
    date: "2024",
    href: "#",
  },
];

export type Affiliation = {
  name: string;
  role: string;
  logo?: string;
  emoji?: string;
};

// TODO: school orgs, dev communities, clubs
export const affiliations: Affiliation[] = [
  { name: "ICpEP.se Region 3", role: "Member", emoji: "🎓" },
  { name: "Dev Community", role: "Member", emoji: "💻" },
  { name: "Organization", role: "Volunteer", emoji: "🇵🇭" },
];

export type Achievement = {
  title: string;
  result: string;
  year: string;
  href?: string;
  featured?: boolean;
};

// TODO: hackathons, competitions, awards, dean's list…
export const achievements: Achievement[] = [
  {
    title: "Hackathon / competition name",
    result: "Champion",
    year: "2025",
    featured: true,
  },
  { title: "School programming contest", result: "Finalist", year: "2024" },
  { title: "Dean's list", result: "Awardee", year: "2024" },
];

// Handles shown in the community panel and chat
export const community = [
  {
    label: "GitHub",
    handle: "@constMelvin",
    href: "https://github.com/constMelvin",
  },
  { label: "LinkedIn", handle: "in/your-handle", href: "#" }, // TODO
  { label: "Instagram", handle: "@your-handle", href: "#" }, // TODO
];
