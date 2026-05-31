import { loadCaseMeta, loadAllDocketEntries } from '@/lib/data';
import { DocketCard } from '@/components/DocketCard';
import { PageHeading } from '@/components/PageHeading';

export const metadata = { title: 'Dockets' };

export default function DocketsIndexPage() {
  const meta = loadCaseMeta();
  const counts = loadAllDocketEntries();

  return (
    <div>
      <PageHeading
        title={meta.dockets.length === 1 ? 'One docket' : `${meta.dockets.length} dockets, one matter`}
        lede="Each docket in the matter, and its filings."
      />
      <div className="grid sm:grid-cols-3 gap-4">
        {meta.dockets.map((d) => (
          <div key={d.id} className="space-y-2">
            <DocketCard docket={d} />
            <p className="ui text-xs uppercase tracking-widest text-muted text-center">
              {counts[d.id].length} entries
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
