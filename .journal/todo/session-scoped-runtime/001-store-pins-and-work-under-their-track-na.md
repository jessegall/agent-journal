---
title: store pins and work under their track name, with current as a pointer
track: session-scoped runtime
at: 2026-09-02T00:11:33+00:00
session: a926a873-bbe7-43a7-baba-958131aff937.jsonl
line: 553
started: 
done: 
how: 
---

From the reasoning critic on the runtime-scoping plan. tracks.switch physically swaps the
live pins/work lists in and out of a parked dict under the record lock. It works, but a
layout where every track's pins and work live under the track's own name and `current` is
only a pointer would need no swap at all and could never file a pin on the wrong track.
Not urgent: the lock covers the race today. Start in tracks.py; pins.py and work.py read
KEY through state.get, so they would take a track argument.
