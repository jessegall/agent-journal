---
title: journal docs: a global catalogue over docs/, each doc a folder of parts
track: session-scoped runtime
at: 2026-09-02T08:20:35+00:00
session: a926a873-bbe7-43a7-baba-958131aff937.jsonl
line: 1099
started: 2026-09-02T08:29:00+00:00
done: 2026-09-02T08:39:25+00:00
how: closed with the work of the same name
asks: 
answer: 
doc: 
---

Agreed design, waiting on the user's go. Global scope, track as provenance.

On disk: docs/<slug>/index.md (title, abstract, status draft|final, track, source, date,
number given once; body is the intro and a draft's open questions) plus parts
01-<slug>.md, 02-<slug>.md; struck parts move to docs/<slug>/struck/ with the reason.
A single-file doc (docs/x.md) is a doc with no parts, adopted in place; splitting it
later turns it into a folder and leaves a one-line pointer so pins citing the path
still resolve.

Commands: docs (catalogue: number, title, status, parts, age, abstract); docs <n>;
docs <n>.<p>; docs add "<title>" --brief; docs part <n> "<title>" --brief; docs replace
<n>.<p> --brief; docs strike <n>.<p> "<why>"; docs final|draft <n>; docs supersede <n>
by <m>; docs index (adopt files without frontmatter, one abstract each, offer to strike
pins that only name a doc); docs search <term> --page=N (the paginated search).

Injected: the catalogue only, capped, drafts marked. Status page gets a docs row.
Subagents cannot write; the main conversation files their reports as parts. Nothing
deleted, only struck. No part-level status; no separate open-questions entity.

Build order: folder format and catalogue; reading and writing parts; adopt and search;
start block and pin migration.
