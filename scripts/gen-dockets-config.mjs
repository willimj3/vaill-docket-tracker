// Generates lib/dockets.config.ts from data/case-meta.yaml.
//
// The client bundle (lib/format.ts is imported by client components like
// WhatsNextRail and DocketEntryRow) needs docket metadata — ids, court labels,
// CourtListener ids, URL slugs, trial/appellate level — but cannot read the
// filesystem. So we derive a small, client-safe TS module from the YAML source
// of truth. Run by predev/prebuild/pretypecheck; the output is committed.
//
//   node scripts/gen-dockets-config.mjs

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const root = process.cwd();
const meta = yaml.load(
  fs.readFileSync(path.join(root, 'data', 'case-meta.yaml'), 'utf8'),
);

const dockets = (meta.dockets || []).map((d) => {
  // The slug is the last path segment of the CourtListener docket URL:
  //   /docket/72379655/anthropic-pbc-v-us-department-of-war/  ->  anthropic-...
  const m = String(d.courtlistener_url || '').match(/\/docket\/\d+\/([^/]+)\/?/);
  return {
    id: d.id,
    court: d.court,
    level: d.level === 'appellate' ? 'appellate' : 'trial',
    courtlistener_id: d.courtlistener_id ?? null,
    slug: m ? m[1] : '',
  };
});

const out = `// AUTO-GENERATED from data/case-meta.yaml by scripts/gen-dockets-config.mjs.
// Do not edit by hand — edit data/case-meta.yaml and re-run \`npm run gen:config\`.
// This module is client-safe (no fs), so client components can resolve docket
// labels and CourtListener URLs without reading the filesystem.

export interface DocketConfig {
  id: string;
  court: string;
  level: 'trial' | 'appellate';
  courtlistener_id: number | null;
  slug: string;
}

export const DOCKETS: DocketConfig[] = ${JSON.stringify(dockets, null, 2)};

export const DOCKET_IDS: string[] = DOCKETS.map((d) => d.id);

const BY_ID: Record<string, DocketConfig> = Object.fromEntries(
  DOCKETS.map((d) => [d.id, d]),
);

/** Look up a docket's config by id; undefined if the id isn't configured. */
export function docketConfig(id: string): DocketConfig | undefined {
  return BY_ID[id];
}
`;

fs.writeFileSync(path.join(root, 'lib', 'dockets.config.ts'), out);
console.log(
  `Wrote lib/dockets.config.ts (${dockets.length} dockets: ${dockets
    .map((d) => `${d.id}/${d.level}`)
    .join(', ')})`,
);
