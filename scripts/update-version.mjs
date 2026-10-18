// Writes the latest OpenLibry release version into the schema.org
// "softwareVersion" field of index.html. Runs at build time (GitHub Action),
// so visitors never contact GitHub and crawlers see the value in static HTML.
import { readFileSync, writeFileSync } from "node:fs";

const REPO = "jzakotnik/openlibry";
const headers = { Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function gh(path) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/${path}`, { headers });
  return res.ok ? res.json() : null;
}

const release = await gh("releases/latest");
let version = release?.tag_name;
if (!version) {
  const tags = await gh("tags?per_page=1");
  version = tags?.[0]?.name;
}
if (!version) {
  console.error("No release or tag found; leaving index.html unchanged.");
  process.exit(1);
}
version = version.replace(/^v/, "");

const file = "index.html";
const html = readFileSync(file, "utf8");
const next = html.replace(
  /("softwareVersion":\s*")[^"]*(")/,
  `$1${version}$2`,
);
if (next === html) {
  console.log(`softwareVersion already ${version}`);
} else {
  writeFileSync(file, next);
  console.log(`softwareVersion set to ${version}`);
}
