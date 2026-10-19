// Loads the CV content from src/data/cv.ts and fingerprints it, so we can tell
// when the website data changed but the CV wasn't regenerated.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const HASH_FILE = new URL("../../cv/.cv-hash", import.meta.url);

export const loadCv = async () => {
	const { cvData } = await import("../../src/data/cv.ts");
	const data = cvData();
	const template = readFileSync(new URL("./template.docx", import.meta.url));
	const hash = createHash("sha256").update(JSON.stringify(data)).update(template).digest("hex").slice(0, 16);
	return { data, hash };
};

// `node scripts/cv/data.mjs` prints the CV data as JSON (used by build_cv.py)
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	process.stdout.write(JSON.stringify(await loadCv()));
}
