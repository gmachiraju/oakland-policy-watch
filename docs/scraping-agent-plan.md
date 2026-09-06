# Weekly Scraping Agent — Plan (not yet built)

Status: planning only. Nothing in this doc is implemented. Slice 1 (the current site) reads a
hand-fabricated snapshot at `data/ordinances.json` via `lib/ordinances.ts` — this plan describes
what replaces that snapshot with real, continuously-updated data.

## Goal

Replace the fabricated snapshot with a weekly pipeline that pulls real Oakland City Council
records, extracts structured ordinance data matching the existing `Ordinance` schema
(`lib/ordinances.ts`), and publishes it to the site only after a human review step.

## Architecture

```
sources (real, see below)
  -> scripts/fetch_records.ts   (weekly, pulls raw agendas/minutes/PDFs + metadata)
  -> scripts/summarize_records.ts (LLM extraction into Ordinance-shaped records)
  -> review step (PR or review table — see Open question below)
  -> human approves
  -> data store (see DB swap below)
  -> site reads from data store instead of the static JSON snapshot
```

Matches the shape from the original architecture discussion: agent never writes straight to
production data — it always lands in a reviewable staging area first.

## Real data sources (from the team's planning deck)

- Oakland City Council Legistar — https://oakland.legistar.com/calendar.aspx (primary source: agendas, minutes, legislation detail pages)
- Oakland Public Meetings — https://www.oaklandca.gov/Government/Meetings-Agendas/Public-Meetings
- Oakland Closed Session Agendas — https://www.oaklandca.gov/Government/Meetings-Agendas/Closed-Session-Agendas
- Oakland Municipal Code + Charter — https://library.municode.com/ca/oakland/codes/code_of_ordinance (for cross-referencing enacted ordinance text)
- Oakland City Attorney public reports — https://www.oaklandcityattorney.org/reports-legal-opinions/public-reports-of-councils-final-decisions-in-closed-sessions/

Legistar is the most structured source (it's the same system many CA municipalities use) and
should be the first target — it exposes agenda items, vote records, and sponsor/author data in a
consistent format, covering most fields the `Ordinance` type already needs (identifier, author,
sponsors, status, voteHistory, keyDates).

## Scheduling

- Weekly cadence, per the deck's own "manual pull weekly on Fridays" note — align the automated
  pull to the same day so it matches council's publishing rhythm.
- Use GitHub Actions on a cron schedule (`.github/workflows/weekly-ingest.yml`), not Vercel Cron —
  the fetch/extraction step is scraping- and LLM-heavy, not a lightweight API route, and Vercel
  Hobby cron is capped at once/day with a loose time window anyway.

## Schema changes needed vs. today's `Ordinance` type

- **Provenance field** — the deck explicitly calls for distinguishing "edited by acorn bot vs.
  human" (their phrasing). Add something like `provenance: "agent" | "human-edited"` once real
  ingestion exists — not needed for the static snapshot today.
- **Resolutions** — this slice deliberately scoped to ordinances only. Real Legistar data will
  include resolutions too; decide then whether to add a `kind: "Ordinance" | "Resolution"`
  discriminator or keep them as a separate type/table.
- **Floor time / word count** — deck lists this as a content field; only meaningful once minutes
  transcripts are actually being scraped, skip until then.

## Review step — open question

Two options from the original architecture discussion, not yet decided:
1. Agent opens a GitHub PR with the new/updated JSON records; a human reviews the diff and merges.
2. Agent writes to a "review" table in the DB; a human approves via a small internal review UI.

PR-based review is simpler to build first (no new UI, git diff *is* the review surface) and fits
this repo's YAGNI bias — likely the starting point, revisit if review volume grows.

## Data store swap

`lib/ordinances.ts` (`getAllOrdinances`, `getOrdinanceBySlug`) is the deliberate seam for this.
When real ingestion lands, those two functions become `async` and read from a DB (Supabase or
Postgres, per the original discussion) instead of importing `data/ordinances.json`. Every caller
(`app/page.tsx`, `app/ordinances/[slug]/page.tsx`) already goes through this helper, so the swap
should not require touching the page components beyond adding `await`.

## Explicitly not decided yet (deck's open questions)

- What hot topics does the community actually care about most? (affects prioritization of which
  Legistar items to extract first)
- What's the right level of detail to surface publicly vs. keep as raw source-linked reference?
- What should the extraction agent do when Legistar data is ambiguous or incomplete — skip, flag
  for review, or best-effort fill?

## Explicitly out of scope for this doc

Not attempting to design the LLM extraction prompt, the review UI (if built), or the Supabase
schema here — those are separate follow-up plans once this pipeline's shape is agreed on.
