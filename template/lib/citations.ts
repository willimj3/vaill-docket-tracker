/**
 * Lookup table mapping case names and statutes/regs to canonical URLs, used by
 * tokenizeAuthorities() to auto-link citations in prose. Empty in the template —
 * /docket-tracker:new (via the narrative-drafter) fills it for a real case.
 *
 * Keys are matched case-insensitively as whole phrases, longest first. Conventions:
 *  - SCOTUS opinions   → Cornell LII /supremecourt/text/{vol}/{page}
 *  - Lower-court cases → CourtListener search URL
 *  - U.S. Code         → law.cornell.edu/uscode/text/{title}/{section}
 *  - C.F.R.            → ecfr.gov
 */

export interface Authority {
  url: string;
  kind: 'opinion' | 'statute' | 'regulation' | 'constitution' | 'article';
}

export const AUTHORITIES: Record<string, Authority> = {};

const SORTED_KEYS = Object.keys(AUTHORITIES).sort((a, b) => b.length - a.length);

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Null when there are no authorities, so tokenizeAuthorities short-circuits
// instead of building an empty-alternation regex that matches everywhere.
const COMBINED = SORTED_KEYS.length
  ? new RegExp(`(?<![A-Za-z0-9])(${SORTED_KEYS.map(escapeRegex).join('|')})`, 'g')
  : null;

export type LinkifyToken = string | { url: string; label: string; key: string };

export function tokenizeAuthorities(text: string): LinkifyToken[] {
  if (!COMBINED) return [text];
  const out: LinkifyToken[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(COMBINED)) {
    const idx = match.index ?? 0;
    if (idx > lastIndex) out.push(text.slice(lastIndex, idx));
    const phrase = match[1];
    const auth =
      AUTHORITIES[phrase] ??
      AUTHORITIES[Object.keys(AUTHORITIES).find((k) => k.toLowerCase() === phrase.toLowerCase()) ?? ''];
    if (auth) {
      out.push({ url: auth.url, label: phrase, key: phrase });
    } else {
      out.push(phrase);
    }
    lastIndex = idx + phrase.length;
  }
  if (lastIndex < text.length) out.push(text.slice(lastIndex));
  return out;
}
