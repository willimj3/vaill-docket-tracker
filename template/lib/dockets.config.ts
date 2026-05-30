// AUTO-GENERATED from data/case-meta.yaml by scripts/gen-dockets-config.mjs.
// Do not edit by hand — edit data/case-meta.yaml and re-run `npm run gen:config`.
// This module is client-safe (no fs), so client components can resolve docket
// labels and CourtListener URLs without reading the filesystem.

export interface DocketConfig {
  id: string;
  court: string;
  level: 'trial' | 'appellate';
  courtlistener_id: number | null;
  slug: string;
}

export const DOCKETS: DocketConfig[] = [
  {
    "id": "example",
    "court": "Example Court",
    "level": "trial",
    "courtlistener_id": 0,
    "slug": ""
  }
];

export const DOCKET_IDS: string[] = DOCKETS.map((d) => d.id);

const BY_ID: Record<string, DocketConfig> = Object.fromEntries(
  DOCKETS.map((d) => [d.id, d]),
);

/** Look up a docket's config by id; undefined if the id isn't configured. */
export function docketConfig(id: string): DocketConfig | undefined {
  return BY_ID[id];
}
