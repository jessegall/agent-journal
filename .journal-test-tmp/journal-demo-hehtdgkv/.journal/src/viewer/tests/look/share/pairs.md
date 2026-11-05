# The share face, checked by screenshot (task 5215)

Fresh loads in a browser, no write through the viewer API: the share links were made on the scratch demo with the command line, the
pages only read. Version 5 on a scratch demo, version 4 on the live journal at port 8420.

| Pair | Version 4 | Version 5 |
| --- | --- | --- |
| A plan at 1280 | plan-v4-1280.png | plan-v5-1280.png |
| A plan at 390 | plan-v4-390.png | plan-v5-390.png |
| A gone link at 1280 | gone-v4-1280.png | gone-v5-1280.png |
| A gone link at 390 | gone-v4-390.png | gone-v5-390.png |
| A document | none | none |

## Fixed

- A visitor who held a valid share cookie and opened a dead link saw the old share instead of the gone screen: the page of a dead
  link now clears the share cookie (story test_a_dead_link_page_clears_the_share_cookie_a_visitor_holds).
- The plan's timeline stayed beside the plan after the window was made narrower: the arrangement now follows the screen width
  (viewer test the arrangement follows the screen when its width changes).

## Listed

- Version 4's share page on the live server draws white and empty (its data.json answers the shell's html, four console errors), so
  the version 4 images are blank and say that; the comparison of looks comes from the version 4 source (ShareApp and ShareStrip):
  version 5 has the same strip (kind, facts, View only, Link ends), the same footer and the same gone words.
- A document: version 4 holds no live document share to look at, and version 5 refuses one, because it has no document to share
  yet (journal share make docs:12 answers that the journal has no documents to share), although the documents module now exists.
  Making documents shareable needs a shared window for them.
- Version 5's plan body is the plans window's one row (title and state) beside the timeline of phases; version 4 drew the whole
  plan page with its phases, tasks and progress. The tasks of the plan are not drawn.
- The read progress line under the strip, which version 4 drew for documents, is not drawn.
- A share page draws empty for a moment while its two reads answer; it has no loading note.
