---
title: spike: can a statusline sidecar supply the real context window
track: session-scoped runtime
at: 2026-09-02T00:11:33+00:00
session: a926a873-bbe7-43a7-baba-958131aff937.jsonl
line: 553
started: 
done: 
how: 
---

context_window is a setting today and the ladder is silent when it is unset. The
statusline command's JSON input carries context_window_size (per the docs); no hook payload
does. A tiny statusline script writing that block to .journal/runtime/ would let the hook
read the true window with no setting. Verify the field first; then decide whether it is
worth a second moving part.
