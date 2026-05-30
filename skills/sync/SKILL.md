---
name: sync
description: |
  Refresh an existing docket-tracker site with the latest filings. Use when the
  user says "refresh my tracker", "pull the latest docket entries", "sync the
  tracker", "update the docket", or "check for new filings" while inside a
  scaffolded tracker repo. For every docket in case-meta.yaml it pulls new
  CourtListener entries (all importances, labeled), appends them, refreshes the
  RECAP-status sidecar, surfaces any pending news, runs the build gate, and
  reports what changed. Distinct from /docket-tracker:new (which scaffolds a new
  tracker from scratch). Commit/deploy stays the user's call.
---

# docket-tracker: sync

Recurring maintenance for an **already-scaffolded** tracker repo: pull the latest
docket activity from CourtListener, refresh derived data, validate, and report.
This is the manual equivalent of what the daily GitHub Action does on its own.

## 0. Confirm we're in a tracker

Run from the repo root. Bail out (don't scaffold) if either is missing — point the
user at `/docket-tracker:new` instead:

```bash
test -f data/case-meta.yaml && test -f scripts/sync_dockets.py && echo OK
```

Read `data/case-meta.yaml` so you know the `dockets:` set (each `id`, `court`,
`courtlistener_id`, `level`). That list — not any hardcoded enum — is the set of
dockets to refresh.

## 1. Pull new entries for every docket

Two interchangeable paths; the bundled script is the one CI uses, so prefer it for
parity.

**Preferred — the bundled script.** Pulls new entries for **all** dockets in
case-meta, classifies each one (`scripts/docket_classifier.py`), and appends them —
**every importance, `high`/`medium`/`low`, labeled, nothing dropped** — under a
clearly-marked `# Auto-appended ... by scripts/sync_dockets.py` divider in each
`data/dockets/<id>-entries.yaml`. It also refreshes `data/dockets/recap-status.json`
(the "PDF not in RECAP" badge). It only appends; it never rewrites existing rows or
touches manual `notes:`.

```bash
# Dry-run first so the user sees what would land before anything is written:
COURTLISTENER_TOKEN=... python3 scripts/sync_dockets.py --dry-run
# Then for real (optionally scope to one docket with --court <id>):
COURTLISTENER_TOKEN=... python3 scripts/sync_dockets.py
```

If `COURTLISTENER_TOKEN` isn't set, ask the user for it (CourtListener account →
API token) rather than guessing. Deps: `pip install pyyaml requests`.

**Alternative — the CourtListener MCP (plugin).** If the connector is available and
the user prefers no token, you can fetch entries through it
(`call_endpoint` `docket-entries` per `courtlistener_id`, `order_by=date_filed`),
then hand the new rows to the same classify/append logic. Use the same labeling
discipline and the same auto-divider; keep dedupe by entry number for `level: trial`
dockets and by description for appellate, matching what `sync_dockets.py` does.

Either way: append-only, all importances labeled, recap-status refreshed.

## 2. (Optional) Surface news + pending approvals

News is a separate, lighter layer — offer it, don't force it:

- `data/alerts-config.yaml` holds the RSS feeds + `relevance_terms` that drive the
  news digest. Mention if the feeds/terms look stale for this case.
- `data/news.yaml` is where candidate items live with `approved: false`. Show the
  user any unapproved entries; promotion to `/press` (the `#news` anchor) is a
  manual `approved: true` flip — **never flip it yourself**. The digest emailer is
  the parked cron monitor, not part of this sync.

## 3. Build gate

Always run the build before reporting success — it's the gate that catches a schema
or data mismatch from the new rows:

```bash
npm run build
```

The `prebuild` hook regenerates `lib/dockets.config.ts` from case-meta, so a docket
you added shows up without code changes. Fix anything the build surfaces before
handing back.

## 4. Report what changed

Summarize concretely:

- per docket: how many new entries appended, broken down by importance, and the
  high-importance ones called out by date + short description;
- whether `recap-status.json` changed (new PDFs now available);
- any pending `news.yaml` items awaiting the user's `approved` flip;
- the build result (pass/fail).

A quick way to show the diff if the repo is git-tracked:

```bash
git status --short data/ && git diff --stat data/dockets/
```

## 5. Commit / deploy is the user's call

Stop here unless asked. Committing and pushing is the user's decision; on push,
Vercel auto-deploys from `main`.

```bash
git add data/ && git commit -m "sync: docket update from CourtListener" && git push
```

Also remind the user: **the daily GitHub Action (`.github/workflows/sync-dockets.yml`,
11:00 UTC) already does this same pull + append + push automatically.** A manual sync
is for when they want the latest right now, or to review before the next scheduled run.

## Discipline

- Append-only. Never rewrite existing rows or strip manual `notes:`; `sync_dockets.py`
  is built to only add under the auto-divider.
- Pull and label **all** importances — `low` rows (notices, pro hac vice, clerk's
  notices) are kept and labeled so the docket page's filter can sort them, not dropped.
- Importance labels are triage; the user promotes/demotes. `news.yaml` approval and any
  narrative edits stay the human's call.
- Be honest about lag: CourtListener mirrors PACER via RECAP, so same-day filings may
  not appear yet — say so rather than implying the docket is exhaustive.