---
name: ViewerRequestFunnel
description: Load it before writing a request in the viewer or a window: a fetch, an EventSource, a WebSocket, an XMLHttpRequest or a sendBeacon, so every request leaves through the one transport file.
summary: Every request of the viewer leaves through src/viewer/src/api/transport.js; a window reads and runs through its window context, and only the transport file calls fetch, EventSource or the like.
tier: mandatory
languages: [typescript, vue]
---

# The viewer's request funnel

Every request of the viewer leaves through `src/viewer/src/api/transport.js`. That file knows, for every window,
what is in flight, its line, its start and whether it is a read or a write. It joins the same read of the same
window, runs at most one more after an event, lets four reads out at once so a write and the event stream always
find a connection, and counts lines by noun and verb.

A request made anywhere else is invisible to all of that: it can run twice at once, hold a connection and stall the
page, and no test or inspector can see it.

## When it fires

- **`request-outside-the-funnel`** - a direct `fetch`, `window.fetch`, `new EventSource`, `new WebSocket`,
  `new XMLHttpRequest` or `navigator.sendBeacon` outside the transport file.

## What to write instead

- A window reads with `context.read(line)` and runs with `context.run(line)`. A line the server calls a read is
  joined, whichever of the two carried it.
- Code outside a window that needs a line uses `lineResult(window, line, environment)`.
- Any other address goes through `transport.raw(url, init, {window, line})`, a file's bytes through
  `transport.bytes(url)` and events through `followEvents`, which shares one stream across the browser's tabs.
- `transport.inFlight(window)` and `transport.sentCounts(window)` say what a window has in flight and what it has sent.

The phone's service worker runs in a scope of its own that cannot load the transport file, so the rule leaves it alone.
