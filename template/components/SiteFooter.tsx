import Link from 'next/link';
import { longDate } from '@/lib/format';
import { loadCaseMeta } from '@/lib/data';

export function SiteFooter({ lastUpdated }: { lastUpdated: string }) {
  const docket = loadCaseMeta().dockets[0];
  return (
    <footer className="ui border-t border-rule mt-20">
      <div className="mx-auto max-w-page px-6 lg:px-10 py-8 text-sm text-muted flex flex-col gap-2 sm:flex-row sm:justify-between">
        <div>
          Last updated <span className="text-ink">{longDate(lastUpdated)}</span>.
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/updates" className="nav-link">Updates</Link>
          {docket?.courtlistener_url ? (
            <a
              href={docket.courtlistener_url}
              className="nav-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              CourtListener
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
