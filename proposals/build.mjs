// Generates proposal pages from ../index.html (content stays identical).
// usage: node build.mjs [outDir] [assetPrefix]
//   default: writes into this folder, assets referenced via "../"
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.argv[2] || here;
const prefix = process.argv[3] ?? "../";
mkdirSync(outDir, { recursive: true });

const src = readFileSync(join(here, "..", "index.html"), "utf8");

const themes = {
  a: { name: "Papier & Tinte", mode: "lines", c1: "%238c2f39", c2: "%23b8893a", h1: "#8c2f39", h2: "#b8893a" },
  b: { name: "Bibliothek bei Nacht", mode: "dots", c1: "%23d6a24a", c2: "%23c0584c", h1: "#d6a24a", h2: "#c0584c" },
  c: { name: "Buchrücken", mode: "rings", c1: "%23d1522f", c2: "%23eab030", h1: "#d1522f", h2: "#eab030" },
};

const switcher = (cur) => `
    <nav class="proposal-switch" aria-label="Design-Vorschläge">
      <span>Vorschlag</span>
      ${Object.entries(themes).map(([k, t]) =>
        `<a href="${k}.html"${k === cur ? ' aria-current="page"' : ""} title="${t.name}">${k.toUpperCase()}</a>`).join("")}
      <small>${themes[cur].name}</small>
    </nav>
    <style>
      .proposal-switch{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2000;display:flex;align-items:center;gap:6px;padding:6px 8px 6px 14px;border-radius:999px;background:#17110d;color:#f4e9d6;font:600 12px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.35)}
      .proposal-switch span{opacity:.6;margin-right:4px;letter-spacing:.06em;text-transform:uppercase;font-size:10px}
      .proposal-switch a{width:30px;height:30px;display:grid;place-items:center;border-radius:50%;color:inherit;text-decoration:none;background:rgba(255,255,255,.1)}
      .proposal-switch a[aria-current]{background:#f4e9d6;color:#17110d}
      .proposal-switch small{font-weight:500;opacity:.75;margin:0 8px 0 6px;font-size:12px}
      @media(max-width:520px){.proposal-switch small{display:none}}
    </style>`;

for (const [key, t] of Object.entries(themes)) {
  let h = src;
  h = h.replace(/(href|src|poster)="(css|js|images|videos)\//g, `$1="${prefix}$2/`);
  h = h.replace('data-theme="dark"', 'data-theme="light"');
  h = h.replace(
    /(<link rel="stylesheet" href="[^"]*contact-form\.css" \/>)/,
    `$1\n    <link rel="stylesheet" href="common.css" />\n    <link rel="stylesheet" href="theme-${key}.css" />`,
  );
  h = h.replace(
    '<div class="hero-grid"></div>',
    `<canvas class="hero-waves" data-mode="${t.mode}"></canvas>`,
  );
  h = h.replace(
    /<script src="([^"]*)main\.js" defer><\/script>/,
    `<script src="waves.js" defer></script>\n    <script src="$1main.js" defer></script>`,
  );
  // replace the multi-colour Docker box with a single-colour cube that matches the other card icons
  h = h.replace(/(<div class="arch-card-icon">)\s*<svg viewBox="0 0 24 24" fill="currentColor">\s*<rect[\s\S]*?<\/svg>/,
    '$1<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.6 19.8 7 12 11.4 4.2 7z"/><path d="M4 8.7l7 3.95v8.1L4 16.8z"/><path d="M20 8.7l-7 3.95v8.1l7-3.95z"/></svg>');
  // the Docker heading carried a LinkedIn logo; use the cube instead
  h = h.replace(/(<h3 class="installation-title">)\s*<svg viewBox="0 0 24 24" fill="currentColor">\s*<path[\s\S]*?<\/svg>/,
    '$1<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.6 19.8 7 12 11.4 4.2 7z"/><path d="M4 8.7l7 3.95v8.1L4 16.8z"/><path d="M20 8.7l-7 3.95v8.1l7-3.95z"/></svg>');
  // brand gradient in logo / newsletter icon / favicon
  h = h.replace(/stop-color="#14b8a6"/g, `stop-color="${t.h1}"`).replace(/stop-color="#a855f7"/g, `stop-color="${t.h2}"`);
  h = h.replace(/%2314b8a6/g, t.c1).replace(/%23a855f7/g, t.c2);
  h = h.replace("</body>", `${switcher(key)}\n  </body>`);
  writeFileSync(join(outDir, `${key}.html`), h);
}
console.log("built", Object.keys(themes).join(", "), "→", outDir);
