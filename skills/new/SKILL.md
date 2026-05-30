---
name: new
description: >-
  Spin up a tracker for <case> — scaffold a complete file-driven Next.js
  litigation-tracker website for a NEW federal case, modeled on the bundled
  template. Use when the user wants to "spin up a tracker for <case>", "build a
  tracker like the DoW one for a new case", "scaffold a litigation tracker", or
  reproduce the Anthropic v. U.S. Dept of War tracker workflow for another
  lawsuit. Copies the bundled Next.js app, fills the docket set from
  CourtListener, classifies/appends entries, and drafts the legal-narrative
  layer for the user's review.
---

# /docket-tracker:new — scaffold a litigation tracker

You scaffold a complete file-driven litigation-tracker **site** for a new federal
case from the bundled template, then fill it. You copy the template's Next.js
`app/`, `components/`, `lib/`, and `scripts/` wholesale, drive the docket set
from `data/case-meta.yaml`, pull and classify each docket's entries from
CourtListener, and draft the legal-narrative layer for the user (a lawyer) to
verify. The template lives at `${CLAUDE_PLUGIN_ROOT}/template`.

## Say this to the user up front

Be honest about the three layers and who owns each:

1. **DATA — you automate it.** Docket entries, importance labels, RECAP/PDF
   status, parties, the site scaffold itself. Pulled from CourtListener and
   classified by `scripts/sync_dockets.py`. No human judgment required.
2. **NEWS — generic engine, you configure it.** Per-case RSS feeds and relevance
   terms in `data/alerts-config.yaml`; the digest is curated and promotion to
   `/news` is a manual `approved: true` flip by the user.
3. **LEGAL NARRATIVE — you DRAFT, the user verifies.** Case-explainer MDX,
   `claims`/`issues`/`holdings`/`glossary`, and `lib/citations.ts` authorities.
   Drafted from primary sources, clearly marked **draft for review**, never
   authoritative. Every fact traces to a source; never fabricate a holding,
   citation, quote, or docket entry.

**The user's call:** `git init`, committing, and deploying (Vercel). You stop at
a green `npm run build`.

## Inputs to gather

1. **The case** — a name, or CourtListener docket URLs/IDs. A case may span
   several courts (a district action plus appeals/petitions); get all of them.
2. **Target directory** — defaults to `~/Documents/<case-slug>-tracker`.

The template is **bundled** at `${CLAUDE_PLUGIN_ROOT}/template`; you don't ask
for a template path.

## Prerequisites

- **CourtListener MCP connector** (the plugin) for data — preferred, no token.
  If absent, the data steps fall back to `COURTLISTENER_TOKEN` + the bundled
  Python scripts. The MCP exposes `search`, `call_endpoint`, `get_endpoint_schema`.
- **Node 20+** and **Python 3.12+** with `pyyaml` (and `requests` for the token
  fallback). Used for the gen-config hooks, the build gate, and the sync scripts.

## Workflow

### Phase 1 — Resolve the case to its dockets
Use the CourtListener MCP (`search` `type:"d"` by `case_name`/`docket_number`, or
`call_endpoint` `dockets` for given IDs). For **each** court record collect: the
CourtListener docket id, the court, a short `id` slug (e.g. `ndcal`, `ca9`,
`dccir`), the `level` (`trial` for district/bankruptcy, `appellate` for
circuits/petitions), the case number, and the CourtListener docket URL (its last
path segment is the slug the site needs). Confirm the full set with the user
before scaffolding — this list IS the configuration.

### Phase 2 — Scaffold from the bundled template
Copy `${CLAUDE_PLUGIN_ROOT}/template` to the target dir, **excluding**
`node_modules/`, `.next/`, and `.git/` (and `.DS_Store`):

```bash
rsync -a --exclude node_modules --exclude .next --exclude .git \
  --exclude '.DS_Store' \
  "${CLAUDE_PLUGIN_ROOT}/template/" "<target>/"
```

Keep everything else: `app/`, `components/`, `lib/`, `scripts/`, all config
(`package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`,
`postcss.config.mjs`, `.github/workflows/`), and `CLAUDE.md` as the conventions
reference. The copied `data/` carries the template's example content — you
replace its content in phases 3–4, not its structure. Do not create a `.git` dir;
the user runs `git init`.

> **The docket enum is gone.** Earlier versions of this workflow had a brittle
> "re-point the hardcoded docket enum" step — editing a closed `'ndcal' |
> 'dccir' | 'ca9'` union across `lib/format.ts`, `lib/data.ts`, every script, and
> the route files. **That friction no longer exists.** The docket set is driven
> entirely by `data/case-meta.yaml`'s `dockets:` list. `lib/dockets.config.ts` is
> GENERATED from it by `scripts/gen-dockets-config.mjs` (run automatically by the
> `predev`/`prebuild`/`pretypecheck` hooks), and the Python scripts read the same
> YAML via `scripts/case_config.py`. Adding or changing a docket is a
> `case-meta.yaml` edit plus a `data/dockets/<id>-entries.yaml` file — **no code
> changes**. Do not edit a court enum; there isn't one to edit.

### Phase 3 — Fill the docket set + pull and classify entries (DATA)
1. **Write `data/case-meta.yaml`.** Set `case_name`, `short_name`, `plaintiff`,
   `filed`, `status_summary`, `last_updated`, and the `dockets:` list from
   phase 1 — one block per court with `id`, `court`, `level`, `case_no`,
   `courtlistener_id`, `courtlistener_url`, and a `status`/`status_color`. This
   is the single source of truth for the docket set.
2. **Create one `data/dockets/<id>-entries.yaml` per docket** (replace the
   template's example files; remove example docket files for ids you don't use).
3. **Pull and classify entries.** Preferred path — the MCP: for each docket,
   `call_endpoint` `docket-entries` with `fields:"entry_number,date_filed,description"`
   (add `recap_documents` only for appellate dockets, small page sizes). Then
   classify each entry's importance with the bundled heuristic and write rows in
   the `data/dockets/*-entries.yaml` schema (`entry`, `date`, `description`,
   `importance: high|medium|low`, optional `documents:`). Keep every entry,
   labeled — nothing is dropped. Fallback path — set `COURTLISTENER_TOKEN` and run
   the bundled script, which does the pull + classify + append + recap-status
   refresh for all dockets:
   ```bash
   COURTLISTENER_TOKEN=xxx python3 scripts/sync_dockets.py --dry-run   # preview
   COURTLISTENER_TOKEN=xxx python3 scripts/sync_dockets.py             # write
   ```
   Either way the importance label comes from `scripts/docket_classifier.py`, the
   same heuristic the daily sync uses, so seed and sync agree.
4. **Fill the rest of the DATA layer:** `data/parties.yaml` (`call_endpoint`
   `parties`/`attorneys` on the lead docket), `data/timeline.yaml` (filing + key
   orders), `data/whats-next.yaml` (upcoming deadlines parsed from recent
   orders/stipulations), and `data/updates.yaml` (a "site scaffolded" entry).
5. **Configure NEWS:** edit `data/alerts-config.yaml` — swap the RSS feeds,
   `relevance_terms`, and Google News queries to this case's parties/terms. Leave
   `data/news.yaml` entries `approved: false`.
6. Set any remaining narrative data files (`claims`, `issues`, `holdings`,
   `glossary`, `commentary`) to valid-but-minimal so the build passes — you draft
   them in phase 4.

### Phase 4 — Draft the legal narrative (DRAFT FOR REVIEW)
Hand this off to the **narrative-drafter agent**
(`${CLAUDE_PLUGIN_ROOT}/agents/narrative-drafter.md`). Give it the resolved
dockets, the populated data, and the primary sources (pull the complaint and key
opinions via the MCP — `call_endpoint` `opinions`/`clusters`,
`html_with_citations`). It drafts, **clearly marked as draft requiring the
user's verification**: `components/CaseExplainer.mdx` and `data/claims.yaml`,
`data/issues.yaml`, `data/holdings.yaml`, `data/glossary.yaml`, plus any
case-specific authorities in `lib/citations.ts`. Every fact must trace to a
primary source per the template's `CLAUDE.md` conventions. Never present this
layer as authoritative; never fabricate a holding, citation, or quote.

### Phase 5 — Wire the sync
The daily refresh is already coded — `scripts/sync_dockets.py` reads the docket
set from the `case-meta.yaml` you wrote, and `.github/workflows/sync-dockets.yml`
runs it at 11:00 UTC, classifies new entries, appends each labeled
high/medium/low under an `# Auto-appended` divider, refreshes
`recap-status.json`, and pushes to `main` (Vercel auto-deploys). Confirm/adjust
the cron with the user. The workflow needs exactly **one** repo secret:
`COURTLISTENER_TOKEN`. Tell the user to add it after they create the GitHub repo:
```bash
gh secret set COURTLISTENER_TOKEN --body "<token>"   # in the repo, post-init
```
No code edits — the workflow is docket-agnostic because the scripts are.

### Phase 6 — Validate with the build gate
From the target dir, install and build:
```bash
npm install && npm run build
```
`prebuild` regenerates `lib/dockets.config.ts` from `case-meta.yaml`, so a green
build confirms the docket set, the generated config, and every data file agree.
This is the gate that catches data/schema mismatches — fix anything it surfaces
(missing required fields, a docket id with no entries file, a bad date). Don't
hand off on a red build.

### Phase 7 — Hand off (git/deploy is the user's call)
Report:
- what's **populated** (the DATA layer and the scaffold),
- what's **draft and needs the user's legal review** (the narrative — name the
  files),
- what's **stubbed/TODO**,
- the commands: `npm run dev` to preview, `git init` + push to GitHub, the
  `gh secret set COURTLISTENER_TOKEN` step, and deploy to Vercel.

Leave `git init`, committing, and deploying to the user.

## Discipline
- The legal narrative is a **draft from primary sources for human verification** —
  never authoritative. The user (a lawyer) reviews before anything is published.
- Every rendered fact must trace to a `data/` file (the template's core rule).
  If you'd hardcode a date/party/status in a component, it belongs in YAML.
- Never fabricate a holding, citation, quote, or docket entry; surface the
  primary source instead.
- Docket importance labels are triage — the user promotes/demotes.
- Be honest about coverage: CourtListener mirrors PACER via RECAP, so very recent
  filings may lag.
- Generic plugin files stay case-agnostic; case specifics live only in the
  scaffolded target's `data/`, `components/CaseExplainer.mdx`, and
  `lib/citations.ts`.

## Keeping it current
Once scaffolded, the daily Action keeps the DATA layer fresh. For an on-demand
refresh or to re-classify after editing patterns, use `/docket-tracker:sync` in
the target dir.