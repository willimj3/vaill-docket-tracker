// Fails the build if the bundled EXAMPLE case's identifiers leak into the site
// CHROME (app/, components/, lib/). Case-specific text belongs in data/*.yaml and
// MDX and must be read via loadCaseMeta()/loadX() — never hardcoded in a page or
// component. This is what keeps every scaffolded tracker from accidentally
// showing the template's example case. Update MARKERS if you re-base the example.
//
//   node scripts/check-generic.mjs   (runs automatically in prebuild)

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

// Distinctive strings from the example case (Anthropic v. U.S. Dept of War).
const MARKERS = [
  /anthropic/i,
  /department of war/i,
  /\bdow\b/i,
  /vanderbilt/i,
  /hegseth/i,
  /fascsa/i,
  /judge lin\b/i,
  /3:26-cv-01996/,
  /\b26-1049\b/,
  /\b26-2011\b/,
];

const SCAN = ['app', 'components', 'lib'];
// Per-case CONTENT that legitimately names the case (the narrative-drafter
// replaces these for a new case); not chrome, so exempt.
const EXCLUDE = [/[/\\]citations\.ts$/, /[/\\]dockets\.config\.ts$/, /\.mdx$/];
const EXTS = new Set(['.ts', '.tsx', '.mjs', '.js']);

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(f);
    else if (EXTS.has(path.extname(e.name))) yield f;
  }
}

const hits = [];
for (const d of SCAN) {
  for (const f of walk(path.join(ROOT, d))) {
    if (EXCLUDE.some((re) => re.test(f))) continue;
    fs.readFileSync(f, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        const t = line.trim();
        // Skip code comments — they don't render; only rendered strings matter.
        if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) return;
        if (MARKERS.some((m) => m.test(line))) {
          hits.push(`${path.relative(ROOT, f)}:${i + 1}  ${t.slice(0, 90)}`);
        }
      });
  }
}

if (hits.length) {
  console.error(
    '\ncheck-generic: example-case strings leaked into the chrome.\n' +
      'Move case-specific text into data/*.yaml and read it via loadCaseMeta()/loadX():\n\n' +
      hits.map((h) => '  ' + h).join('\n') +
      '\n',
  );
  process.exit(1);
}
console.log('check-generic: chrome is case-agnostic ✓');
