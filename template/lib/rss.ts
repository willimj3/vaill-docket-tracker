import Parser from 'rss-parser';

export interface FeedItem {
  source: string;
  title: string;
  link: string;
  isoDate: string;
  contentSnippet: string;
}

const parser = new Parser({
  timeout: 15_000,
  headers: { 'User-Agent': process.env.MONITOR_USER_AGENT || 'docket-tracker' },
});

export async function fetchFeed(url: string): Promise<FeedItem[]> {
  const feed = await parser.parseURL(url);
  const sourceName = feed.title ?? url;
  return (feed.items ?? []).map((it) => ({
    source: sourceName,
    title: it.title ?? '(untitled)',
    link: it.link ?? '',
    isoDate: it.isoDate ?? new Date().toISOString(),
    contentSnippet: it.contentSnippet ?? '',
  }));
}

/** True iff the item mentions the anchor term AND any relevance term. */
export function isRelevant(item: FeedItem, terms: string[], anchor: string): boolean {
  const hay = `${item.title} ${item.contentSnippet}`.toLowerCase();
  if (anchor && !hay.includes(anchor.toLowerCase())) return false;
  return terms.some((t) => hay.includes(t.toLowerCase()));
}
