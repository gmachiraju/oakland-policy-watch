# Repository Guidelines

Before writing any code, stop at the first rung that holds:

Does this need to be built at all? (YAGNI, you aren't gonna need it) Does it already exist in this codebase? Reuse the helper, util, or pattern that's already here, don't re-write it. Does the standard library already do this? Use it. Does a native platform feature cover it? Use it. Does an already-installed dependency solve it? Use it. Can this be one line? Make it one line. Only then: write the minimum code that works. The ladder runs after you understand the problem, not instead of it: read the task and the code it touches, trace the real flow end to end, then climb.

Bug fix = root cause, not symptom: a report names a symptom. Grep every caller of the function you touch and fix the shared function once — one guard there is a smaller diff than one per caller, and patching only the path the ticket names leaves a sibling caller still broken.

Rules:

No abstractions that weren't explicitly requested. No new dependency if it can be avoided. No boilerplate nobody asked for. Deletion over addition. Boring over clever. Fewest files possible. Shortest working diff wins, but only once you understand the problem. The smallest change in the wrong place isn't lazy, it's a second bug. Question complex requests: "Do you actually need X, or does Y cover it?" Pick the edge-case-correct option when two stdlib approaches are the same size, lazy means less code, not the flimsier algorithm. Mark deliberate simplifications that cut a real corner with a known ceiling (global lock, O(n²) scan, naive heuristic) with a ponytail: comment naming the ceiling and upgrade path. Not lazy about: understanding the problem (read it fully and trace the real flow before picking a rung, a small diff you don't understand is just laziness dressed up as efficiency), input validation at trust boundaries, error handling that prevents data loss, security, accessibility, the calibration real hardware needs (the platform is never the spec ideal, a clock drifts, a sensor reads off), anything explicitly requested. Lazy code without its check is unfinished: non-trivial logic leaves ONE runnable check behind, the smallest thing that fails if the logic breaks (an assert-based demo/self-check or one small test file; no frameworks, no fixtures). Trivial one-liners need no test.

These instructions apply to all files in this repository.

# Repository Overview
This repo's goal is to host an agentic policy scraping tool + analytics for the city of Oakland's legislation. We primarily plan to scrape information from the city council and track information (e.g. provenance, voting history, resolutions, etc.) over time. 

## External Planning Docs:
We created a document to gather the source materials that will be critical in the website development. A public document can be found here: https://docs.google.com/presentation/d/1-JXOXXCHNSKxIwG2BQ1x_9z4rLCJuMX7As-SxxL2KTc/edit?usp=drivesdk. Feel free to check out this document periodically since it will be updated by our policy team.

A good styllistic reference is CalMatters: https://calmatters.digitaldemocracy.org/. A good bill-level analysis can be found at: https://calmatters.digitaldemocracy.org/bills/ca_202520260ab2000.



<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
