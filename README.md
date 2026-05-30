# docket-tracker

A Claude Code plugin that scaffolds and maintains a **file-driven litigation-tracker website** for any U.S. federal case, fed by [CourtListener](https://www.courtlistener.com/).

It is the generalized, reproducible form of the *Anthropic PBC v. U.S. Department of War* tracker. You point it at a case (a name or some CourtListener docket URLs), and it produces a Next.js 15 + MDX site that tracks every docket in the matter — district, circuit, and any parallel petitions — with importance-classified filings, RECAP PDF-availability badges, a timeline, parties, and a drafted legal explainer. No database: every fact lives in `data/*.yaml` or MDX and renders at build time.

A daily GitHub Action pulls new filings from CourtListener and commits them; Vercel auto-deploys on push.

---

## The honest 3-layer split

This plugin does not pretend a website about a lawsuit can be fully automated. It splits the work into three layers and is explicit about which is which:

| Layer | What it is | Who's responsible |
|---|---|---|
| **1. Data** | Docket entries, importance labels, RECAP PDF status, parties, case metadata | **Automated** from CourtListener — pulled, classified, and committed daily with no human in the loop. |
| **2. News** | RSS feeds + relevance terms per case; a digest of candidate stories | **Configured** by you. The engine is generic; you set the feeds and terms, and a human flips each item to `approved: true` before it shows on the site. |
| **3. Legal narrative** | The case-explainer MDX, claims / issues / holdings / glossary, and the `lib/citations.ts` authorities | **Drafted for a lawyer to review.** Generated from primary sources, clearly marked as a draft, and never authoritative. |

### ⚠️ Disclaimer

**The legal-narrative layer is a machine-generated draft, not legal advice and not a statement of law.** It is produced from primary court documents to give a qualified attorney a head start, and it **must be reviewed and verified by a licensed lawyer before publication.** Every fact is meant to trace to a source; the plugin is instructed never to fabricate a holding, citation, quote, or docket entry. Treat anything in this layer as unverified until a competent professional has signed off. CourtListener mirrors PACER via RECAP, so very recent filings can lag — confirm against the official docket for anything time-sensitive.

---

## Install

This repository is its own Claude Code marketplace. From inside Claude Code:

```text
/plugin marketplace add willimj3/vaill-docket-tracker
/plugin install docket-tracker@docket-tracker
```

To hack on it locally instead, load it straight from a clone without installing:

```bash
claude --plugin-dir /path/to/vaill-docket-tracker
```

Restart Claude Code (or reload plugins) when prompted, and the two skills, the agent, and the CourtListener connector become available.

---

## What you get

**Skills**

- **`/docket-tracker:new \"<case name or CourtListener docket URLs>\"`** — Scaffolds a new tracker. Resolves the case to its set of dockets, copies the bundled `template/` Next.js app into a target directory, writes `data/case-meta.yaml` and the per-docket entry files, populates the data layer from CourtListener, drafts the legal-narrative layer for your review, and runs `npm run build` as the gate. Leaves `git init`, committing, and deploying to you.
- **`/docket-tracker:sync`** — Refreshes an existing tracker. Pulls new CourtListener entries, classifies their importance, appends them (labeled `high` / `medium` / `low`, nothing dropped) to `data/dockets/*-entries.yaml`, and refreshes the RECAP-status badges. This is the same logic the daily GitHub Action runs — use the skill for an on-demand pull or to backfill.

**Agent**

- **`narrative-drafter`** — A subagent the `new` skill delegates to for the legal-narrative layer. It reads the complaint and key opinions from CourtListener and drafts the case explainer, claims, issues, holdings, and glossary — always marked as a draft for the lawyer's verification, with every fact traced to a primary source.

**Bundled template** — `template/` is the complete Next.js 15 + MDX app the `new` skill copies. File-driven, no database, deployable to Vercel as-is.

---

## The headline: adding a docket is one edit

The docket set is driven **entirely** by the `dockets:` list in `data/case-meta.yaml`. Each entry is just (ids and courts below are illustrative — use your own case's values):

```yaml
dockets:
  - id: district
    court: D. Example
    level: trial            # trial | appellate
    courtlistener_id: 10000001
  - id: appeal
    court: 9th Cir.
    level: appellate
    courtlistener_id: 10000002
```

Adding a court — a new appeal, a parallel petition, a transferred case — is a `case-meta.yaml` edit plus a `data/dockets/<id>-entries.yaml` file. **No code changes.** `lib/dockets.config.ts` is generated from `case-meta.yaml` by `scripts/gen-dockets-config.mjs` (run automatically on `predev` / `prebuild` / `pretypecheck`), and the Python scripts read the same YAML via `scripts/case_config.py`. There is no enum to repoint.

---

## Adopter setup

You need a few accounts to run the full pipeline. The site itself builds and previews locally with none of them; the data, sync, and news layers need the items below.

1. **CourtListener API token (free, required for sync).** Sign up at [courtlistener.com](https://www.courtlistener.com/), then create a token under your profile. This is `COURTLISTENER_TOKEN`. It is what the daily sync and the Python scripts use.

2. **CourtListener connector (preferred for scaffolding).** Connect the CourtListener MCP connector in Claude Code. When it is present, the `new` skill and the `narrative-drafter` agent fetch dockets, entries, parties, and opinions through it — **no token needed at scaffold time.** The connector is configured in this plugin's `.mcp.json`. The standalone token (#1) is still required for the automated daily sync, which runs outside Claude.

3. **A GitHub repo with the Action secret.** Push the generated tracker to GitHub. The bundled `.github/workflows/sync-dockets.yml` runs daily (11:00 UTC), pulls new entries, and commits them straight to `main`. It needs exactly one repo secret:
   - `COURTLISTENER_TOKEN` — add it under **Settings → Secrets and variables → Actions**.

   The workflow uses the built-in `GITHUB_TOKEN` for write access; no other secret is required. (To review syncs on a PR instead of committing to `main`, change the workflow's final `git push` step to open a pull request.)

4. **A Vercel deployment.** Import the GitHub repo into Vercel. It auto-detects Next.js; no special config. Every push to `main` — including the daily sync commits — redeploys the site.

5. **Email digest for the news layer (optional).** To receive the news digest, set one email provider key plus a cron secret:
   - `RESEND_API_KEY` **or** `POSTMARK_TOKEN`
   - `CRON_SECRET` — a random string that gates the cron handlers (they fail closed without it)

   Configure the feeds and relevance terms in `data/alerts-config.yaml`. The digest only surfaces candidate stories; promotion to the public `/news` page stays a manual `approved: true` flip in `data/news.yaml`. (The Vercel cron monitors are parked by default; the daily GitHub Action is the primary, preferred sync path because the Actions runner can write to the repo and the Vercel serverless filesystem is read-only at runtime.)

**Local requirements:** Node 20+ to build and preview the site; Python 3.12 with `pyyaml` and `requests` to run the data scripts by hand.

---

## Quickstart

```text
# 1. Add this repo as a marketplace and install the plugin
/plugin marketplace add willimj3/vaill-docket-tracker
/plugin install docket-tracker@docket-tracker

# 2. Scaffold a tracker for your case
/docket-tracker:new \"Acme Corp v. United States\"
#   …or paste CourtListener docket URLs:
/docket-tracker:new \"https://www.courtlistener.com/docket/10000001/... https://www.courtlistener.com/docket/10000002/...\"
```

The skill confirms the docket set with you, builds the site, and reports what is populated (data), what is **drafted and needs your legal review** (narrative), and what is stubbed. Then:

```bash
cd <your-case>-tracker
npm install
npm run dev      # http://localhost:3000
npm run build    # the gate that catches data/schema mismatches
```

When it looks right: `git init`, push to GitHub, add the `COURTLISTENER_TOKEN` secret, import into Vercel — and the tracker keeps itself current.

To pull fresh filings on demand at any time, run `/docket-tracker:sync`.

---

## How updates flow

- **Daily, automatic (data layer):** GitHub Action → `scripts/sync_dockets.py` → CourtListener → classify + append new entries → refresh RECAP badges → commit to `main` → Vercel redeploys.
- **As you curate (news layer):** digest surfaces candidates → you flip `approved: true` in `data/news.yaml`.
- **As your lawyer reviews (legal layer):** edit the drafted MDX and `claims` / `issues` / `holdings` / `glossary` YAML; commit.

There is no admin UI. Everything is committed text, which is the point: every change is reviewable in a diff.

---

## Reminders

- The legal narrative is a draft for human verification — never authoritative, never legal advice.
- Every rendered fact must trace to a `data/` file or primary source.
- Importance labels are triage; you promote or demote.
- CourtListener can lag PACER on very recent filings — verify anything time-sensitive against the official docket.

---
