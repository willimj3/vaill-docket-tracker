import { format, parseISO } from 'date-fns';
import { docketConfig } from '@/lib/dockets.config';

/** Long form: "March 26, 2026". */
export function longDate(iso: string): string {
  try {
    return format(parseISO(iso), 'MMMM d, yyyy');
  } catch {
    return iso;
  }
}

/** Short form: "Mar 26, 2026". */
export function shortDate(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d, yyyy');
  } catch {
    return iso;
  }
}

/** Month-year for grouping ("March 2026"). */
export function monthYear(iso: string): string {
  try {
    return format(parseISO(iso), 'MMMM yyyy');
  } catch {
    return iso;
  }
}

/** YYYY-MM key for stable sorting. */
export function monthKey(iso: string): string {
  try {
    return format(parseISO(iso), 'yyyy-MM');
  } catch {
    return iso.slice(0, 7);
  }
}

export function courtLabel(id: string): string {
  return docketConfig(id)?.court ?? id;
}

/** Root CourtListener URL for the docket (no entry segment). */
export function clDocketUrl(court: string): string | null {
  const d = docketConfig(court);
  if (!d?.courtlistener_id || !d.slug) return null;
  return `https://www.courtlistener.com/docket/${d.courtlistener_id}/${d.slug}/`;
}

/**
 * CourtListener URL for a specific docket entry. For trial-court dockets
 * (ndcal), CL accepts the bare entry number. For appellate dockets, the URL
 * path component is the full document_number (with leading zeros), which only
 * works if we have it from the recap-status sidecar — otherwise fall back to
 * the docket root.
 *
 * The dccir TSV's "Entry" column is a scrape ID that does NOT correspond to
 * any CL URL segment, so it must never be used as the path component.
 */
export function clEntryUrl(
  court: string,
  entryNumber: string | number | null | undefined,
  documentNumber?: string | null,
): string | null {
  const d = docketConfig(court);
  if (!d?.courtlistener_id || !d.slug) return null;

  const isTrial = d.level === 'trial';
  let pathComponent: string | null = null;
  if (documentNumber) {
    pathComponent = documentNumber;
  } else if (isTrial && entryNumber && entryNumber !== '-') {
    pathComponent = String(entryNumber);
  }

  if (!pathComponent) {
    return clDocketUrl(court);
  }
  return `https://www.courtlistener.com/docket/${d.courtlistener_id}/${pathComponent}/${d.slug}/`;
}
