// Runs before `npm run build`: warns (never fails) when the website data has
// changed since the CV was last generated with `npm run cv`.
import { existsSync, readFileSync } from "node:fs";
import { HASH_FILE, loadCv } from "./data.mjs";

try {
	const { hash } = await loadCv();
	const saved = existsSync(HASH_FILE) ? readFileSync(HASH_FILE, "utf8").trim() : "";
	if (saved !== hash) {
		console.warn(
			"\n\x1b[33m⚠  Your CV is out of date with the website data.\x1b[0m\n" +
				"   Run \x1b[1mnpm run cv\x1b[0m to regenerate the Download CV PDF.\n"
		);
	}
} catch {
	// Older Node without TypeScript support (e.g. on a CI server) — skip the check
}
