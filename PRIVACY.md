# Privacy Policy

_Last updated: May 2026_

**docket-tracker** is an open-source, MIT-licensed Claude Code plugin that scaffolds and
maintains a static, file-driven litigation-tracker website from public U.S. federal court
records.

## What the plugin collects

**Nothing.** The plugin runs locally in your own Claude Code session, and the sites it
scaffolds run in your own GitHub repository and hosting (for example, Vercel). It contains
no analytics, no telemetry, and no "phone home." The author/maintainer receives no data
about you or your use of the plugin.

## Data the plugin reads

The plugin fetches **public court records** (dockets, filings, opinions) from
[CourtListener](https://www.courtlistener.com/), operated by the nonprofit Free Law
Project. Your use of that data is governed by CourtListener's own
[terms and privacy practices](https://www.courtlistener.com/terms/). If you supply a
`COURTLISTENER_TOKEN`, it stays in your local environment or your CI secrets and is never
transmitted to the plugin's author.

## Optional features

- The **CourtListener MCP connector** (`mcp.courtlistener.com`) authenticates via OAuth
  directly between you and Free Law Project; the author is not involved.
- The **parked email-digest** feature, if you choose to enable it, sends mail through your
  own provider (Resend or Postmark) to recipients you configure. The author has no access
  to any of it.

## The sites you build

A scaffolded tracker and all of its content are yours. You control where it is hosted and
any data it contains. Court filings reproduced in it are public-domain works of the U.S.
federal government.

## Contact

Questions: open an issue at <https://github.com/willimj3/vaill-docket-tracker/issues>.
