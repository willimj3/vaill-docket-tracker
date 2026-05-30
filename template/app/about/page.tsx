import Link from 'next/link';
import { PageHeading } from '@/components/PageHeading';
import { loadCaseMeta } from '@/lib/data';

export const metadata = { title: 'About' };

export default function AboutPage() {
  const meta = loadCaseMeta();

  return (
    <div className="prose-page">
      <PageHeading
        title="About this site"
        lede="A focused explainer and live tracker for one piece of litigation."
      />

      <section>
        <h2>What this site is</h2>
        <p>
          An explainer and litigation tracker for <em>{meta.case_name}</em>, a single underlying
          dispute litigated across {meta.dockets.length}{' '}
          federal {meta.dockets.length === 1 ? 'forum' : 'forums'}:
        </p>
        <ul className="list-disc pl-5">
          {meta.dockets.map((d) => (
            <li key={d.id}>
              {d.court} — {d.case_no}
              {d.status ? ` (${d.status})` : ''}.
            </li>
          ))}
        </ul>
        <p>
          The site is intended for readers who know law but not this case. It does not take a
          litigation position. Where the editor&apos;s view is necessary — for example, in weighting
          which docket entries are &quot;high importance&quot; — that judgment is flagged and traceable to
          the underlying data files in this repository.
        </p>
      </section>

      <section>
        <h2>Methodology</h2>
        <p>
          Every fact on the site lives in a YAML or MDX file under <code>data/</code>. The build
          process reads those files; there is no database. The doctrinal substance lives at{' '}
          <Link href="/law">/law</Link>; press coverage and commentary at{' '}
          <Link href="/press">/press</Link>.
        </p>
        <p>
          Docket entries are mirrored from CourtListener&apos;s RECAP archive and labeled by
          importance with a heuristic that the editor reviews and adjusts. The legal-analysis
          sections are drafted from primary sources and are meant to be reviewed by a qualified
          lawyer before they are relied upon.
        </p>
      </section>

      <section>
        <h2>Updates and corrections</h2>
        <p>
          The site updates as the litigation moves. A change log is at{' '}
          <Link href="/updates">/updates</Link>. CourtListener docket alerts and a daily monitor
          surface new filings for review.
        </p>
        <p>To suggest a correction, open an issue on the project&apos;s GitHub repository.</p>
      </section>

      <section>
        <h2>Use and license</h2>
        <p>
          Prose on this site is licensed{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/">CC&nbsp;BY&nbsp;4.0</a>. Code is
          MIT-licensed. Government filings reproduced here are public-domain works of the federal
          government; third-party briefs and commentary excerpts are reproduced under fair use.
        </p>
      </section>
    </div>
  );
}
