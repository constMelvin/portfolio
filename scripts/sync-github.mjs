// Builds public/github-activity.json: contributions per day across ALL your repos
// (private ones included), so the portfolio graph matches what you see on your own
// GitHub profile. Only dates and counts are written — no repo names or code.
//
// Usage: npm run github:sync   (needs the GitHub CLI, logged in: `gh auth login`)
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const TIMEZONE = "Asia/Manila"; // GitHub buckets your contributions by your local day
const OUT = new URL("../public/github-activity.json", import.meta.url);

const gql = (query, variables = {}) => {
	const args = ["api", "graphql", "-f", `query=${query}`];
	for (const [k, v] of Object.entries(variables)) args.push("-F", `${k}=${v}`);
	return JSON.parse(execFileSync("gh", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })).data;
};

const day = (iso) => new Date(iso).toLocaleDateString("en-CA", { timeZone: TIMEZONE }); // YYYY-MM-DD

const since = new Date();
since.setFullYear(since.getFullYear() - 1);
since.setDate(since.getDate() - 7);

const { viewer } = gql(`{ viewer { id login } }`);
const counts = {};
const add = (iso) => {
	if (new Date(iso) < since) return;
	const d = day(iso);
	counts[d] = (counts[d] ?? 0) + 1;
};

// Repos you own (public + private, no forks). Repo creation itself isn't counted here:
// GitHub only counts it for public repos, and those already come from the live API.
const repos = gql(`{ viewer { repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
	nodes { name createdAt defaultBranchRef { name } } } } }`).viewer.repositories.nodes;

let commits = 0;
for (const repo of repos) {
	if (!repo.defaultBranchRef) continue;
	let after = null;
	do {
		const res = gql(
			`query($name: String!, $id: ID!, $since: GitTimestamp!, $after: String) {
				viewer { repository(name: $name) { defaultBranchRef { target { ... on Commit {
					history(first: 100, after: $after, since: $since, author: { id: $id }) {
						pageInfo { hasNextPage endCursor }
						nodes { authoredDate }
					} } } } } } }`,
			{ name: repo.name, id: viewer.id, since: since.toISOString(), ...(after && { after }) }
		);
		const history = res.viewer.repository.defaultBranchRef.target.history;
		history.nodes.forEach((c) => add(c.authoredDate));
		commits += history.nodes.length;
		after = history.pageInfo.hasNextPage ? history.pageInfo.endCursor : null;
	} while (after);
}

// Pull requests and issues you opened
const search = (type) =>
	gql(`{ search(query: "author:${viewer.login} type:${type} created:>=${since.toISOString().slice(0, 10)}", type: ISSUE, first: 100) {
		nodes { ... on PullRequest { createdAt } ... on Issue { createdAt } } } }`).search.nodes;
const prs = search("pr");
const issues = search("issue");
[...prs, ...issues].forEach((n) => add(n.createdAt));

const total = Object.values(counts).reduce((a, b) => a + b, 0);
writeFileSync(
	OUT,
	JSON.stringify({ generatedAt: new Date().toISOString(), user: viewer.login, total, days: counts }, null, "\t") + "\n"
);
console.log(
	`github-activity.json: ${total} contributions (${commits} commits, ${prs.length} PRs, ${issues.length} issues across ${repos.length} repos)`
);
