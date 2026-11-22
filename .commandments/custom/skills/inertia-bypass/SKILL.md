---
name: InertiaBypass
description: Reaching the server from the frontend: an import of the JSON request client (jsonRequests, postJson, getJson, pollJson) or axios in a component or module. Read this before writing one, and when an inertia-bypass finding points here.
summary: Every frontend request goes through Inertia: reads are a page's props, changes are its actions.
tier: keep-in-mind
languages: [typescript, vue]
---

# Never bypass Inertia

Every request the frontend makes goes through Inertia (user message 13525). A JSON request around it carries no
Inertia headers, so a link or visit to it shows a raw JSON page; its answer is no page, so the screen does not
follow it; and its errors never reach the page's props, so a refusal has nowhere to show.

- **A read is a page prop.** Declare the page in its module's pages class (`Page::make(...)->at(...)`) with a resolver
  that reads the data; the component reads `props.page`. To read it again, `router.reload({ only: ['page'], data })`:
  the reload's `data` is the query the resolver reads (an epoch, a cursor, a filter).
- **A change is a page action.** Declare it with `->actions(ActionRoute::post(...))` on the page and call it with
  `router.post(action.url(...), body, { only: ['page'], preserveState: true })` (rule 56). The controller answers
  through `ReviewResponses`, and a refusal arrives as the page's `errors`.
- **Polling is a reload on a timer**, never a JSON poll: `router.reload({ only: ['page'], async: true })`.
- The terminal page (`app/Pages/WebPages.php`, `useTerminalFrames.ts`) is the worked example of all three.

```ts
// Before: around Inertia
const reply = await postJson(share.url(id), { to });

// After: the page's own action, answering with only its prop
router.post(share.url(id), { to }, { only: ['page'], preserveState: true });
```
