# John Melvin Domingo — Portfolio

Personal portfolio built with React, TypeScript, Vite, Tailwind CSS and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

## Updating content

All content lives in **`src/data/portfolio.ts`** — profile, projects, experience, stack, education and more.
The CV behind the **Download CV** button is generated from the same file (`src/data/cv.ts`), so the two stay in sync.

| Command | What it does |
|---|---|
| `npm run cv` | Regenerates `public/John-Melvin-Domingo-CV.pdf` and the editable `cv/John-Melvin-Domingo-CV.docx` (needs Microsoft Word or LibreOffice) |
| `npm run github:sync` | Refreshes the contributions graph from all repos, private included (needs `gh auth login`) |
| `npm run sync` | Both of the above |
| `npm run build` | Production build — warns if the CV is out of date |

The **Sync CV & GitHub graph** GitHub Action does this automatically: it regenerates the CV when `src/data` changes, refreshes the graph daily, and commits the results so Vercel redeploys.
