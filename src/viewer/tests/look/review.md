# Version 4 against version 5, desktop width (1280)

Each line is one difference found, its screenshot pair in this folder and what was done. Phone width was left out on the user's word.

| # | Screen | Difference | Pair | State |
|---|--------|------------|------|-------|
| 1 | Chat | Docked items sat above the history; version 4 has them at the bottom, above the composer | bottom-v4.png, bottom-v5.png | fixed |
| 2 | Every screen | Ghost buttons had a visible border; version 4 draws none, except Open on a dock and Dump files | bottom-v4.png, bottom-v5.png | fixed |
| 3 | Sidebar | No header with the project mark | sidebar-v4.png, sidebar-v5.png | fixed |
| 4 | Sidebar | Windows were one flat list; version 4 groups them in foldable sections | sidebar-v4.png, sidebar-v5.png | fixed |
| 5 | Sidebar | No count beside a window with rows to look at | sidebar-v4.png, sidebar-v5.png | fixed |
| 6 | Sidebar | No version line at the foot | sidebar-v4.png, sidebar-v5.png | fixed |
| 7 | Top of the page | No breadcrumb of project, environment and page | sidebar-v4.png, sidebar-v5.png | fixed |
| 8 | Settings | No search field | settings-v4.png, settings-v5.png | fixed |
| 9 | Settings | No list of sections beside the settings to jump to one | settings-v4.png, settings-v5.png | fixed |
| 10 | Settings | A flag drew as a bordered button; version 4 draws a filled switch | settings-v4.png, settings-v5.png | fixed |
| 11 | Settings | Sections sat close together; spacing now follows version 4's calm gaps | settings-v4.png, settings-v5.png | fixed |
| 12 | Chat: messages, marks, pins, composer, docked cards | Earlier differences of report 1147 | messages, marks, pins, composer and docked pairs | fixed |
| 13 | Bars at the top, side panels | Earlier differences of report 1147 | top-bars and side-panels pairs | fixed |

Not compared one by one: the module windows other than chat, tasks and settings. Version 5 draws them with the same kit as the chat and settings.

## Windows, one by one (1280, each as a page of its own: ?environment=...&page=<window>)

| # | Window | Difference | Pair | State |
|---|--------|------------|------|-------|
| 14 | Plans | Cards with the plan's id, state, task count bar and phase, and Open and Closed tabs (PlanCards) | windows/plans-v4.png, windows/plans-v5.png | fixed, except the New plan button |
| 15 | Documents | Search, tabs and date-grouped list drawn already; the New document button is not drawn | windows/documents-v4.png, windows/documents-v5.png | open: New document button needs a create form |
| 16 | Tasks | Search box and a group for each state with its mark, number and priority (TaskGroups); grouping by plan and phase waits on a task-to-plan row | windows/tasks-v4.png, windows/tasks-v5.png | fixed, except grouping by plan |
| 17 | Agents | Rows now show number, session, program and role, and Running or Closed with the time | windows/agents-v4.png, windows/agents-v5.png | fixed |
| 18 | Checks | Cards show Passing, Failing or Not run and the command; the Run and New check buttons are not drawn | windows/checks-v4.png, windows/checks-v5.png | fixed, except Run and New check buttons |
| 19 | File edits | Empty state in the demo; version 4's Files page is a file browser, a different feature | windows/fileedits-v4.png, windows/fileedits-v5.png | open: different feature |
| 20 | Phone pairing | Version 5 has Pair a phone and its row; version 4 has no page of its own for it | windows/phone-v4.png, windows/phone-v5.png | same |
| 21 | Plugins | Cards with a switch, release, source and the last fault (PluginRows) | windows/plugins-v4.png, windows/plugins-v5.png | fixed, except the install field |
| 22 | Questions | Answered and closed questions show their answer or Closed; open ones keep the answer form | windows/questions-v4.png, windows/questions-v5.png | fixed |
| 23 | Sequences | Card shows its age beside the number | windows/sequences-v4.png, windows/sequences-v5.png | fixed, except the New sequence button |
| 24 | Suggestions | Empty state in the demo; version 4 shows suggestions in a notification panel | windows/suggestions-v4.png, windows/suggestions-v5.png | open: different place |
| 25 | Templates | Card shows its age beside the number | windows/templates-v4.png, windows/templates-v5.png | fixed |
| 26 | Triggers | Card shows its age beside the number | windows/triggers-v4.png, windows/triggers-v5.png | fixed, except the New trigger button |
| 27 | Tasks (agent) | Version 5 names the window Tasks now; on a page of its own it needs an agent and says so | windows/workers-v4.png, windows/workers-v5.png | open: needs an agent |
| 28 | Every window as a page | A window page had no gutter around its content | windows/*-v5.png | fixed |
| 29 | Chat pins | The strip had padding around it; version 4 runs it flush with the chat's sides and top | bottom-v5.png | fixed |
| 30 | Bars and headers | An icon button stretched to the height of its bar; now a fixed 24 pixel square, centred | bottom-v5.png | fixed |
| 31 | Agent tasks window | Named To-do list; now Tasks, with its empty text saying tasks | windows/workers-v5.png | fixed |
| 32 | Every list and window | A blank while the first read was out; now one shared skeleton shaped like what is coming, fading into the content | not a still | fixed |

Memories, pins, dumps, processes and sharing have no window of their own in version 5 (they draw in the chat, the settings and the activity panel), so there is no page of theirs to pair.
Lines marked open differ from version 4 in content or toolbar that these windows do not draw yet.

## The status bars (task 5490), pair bars-v4.png, bars-v5.png

| # | Item | Difference | State |
|---|------|------------|-------|
| S1 | Agent state | Dot, Working or Ended, program, role and session | fixed (already drawn, kept) |
| S2 | Helpers running | Version 4 shows a count in the status bar; version 5 draws "N helpers" there, opening Helpers | fixed |
| S3 | Open tasks | Counted from the tasks not completed or cancelled, opening Tasks | fixed |
| S4 | Questions waiting | Counted from the open questions, opening Questions | fixed |
| S5 | Uptime | Minutes the agent process has run | fixed (already drawn, kept) |
| S6 | Live | Both bars read the journal again every five seconds | fixed |
| S7 | Work in hand (the task the agent holds) | No row ties the main agent to a task yet | no data; no task gives it yet |
| S8 | Pause and stop buttons | No command pauses or stops an agent yet | no data; no task gives it yet |
| S9 | Fitness chips (100, 0.59) | Version 5 keeps no fitness score | no data; no task gives it yet |
| S10 | Mode (Builder, Orchestrator, Solo) | Version 5 has no mode setting | no data; no task gives it yet |
| S11 | Context percentage and its bar | Version 5's agent row carries no context use | no data; no task gives it yet |
| S12 | Model and effort (opus, high) | Version 5's agent row carries neither | no data; no task gives it yet |
| S13 | Usage and limit countdown (11d 3h) | Version 5 reads no usage | no data; no task gives it yet |

## Search window (task 5492), version 4 pair search-v4.png

| # | Item | Difference | State |
|---|------|------------|-------|
| W1 | Search page | Version 4 has a search box, a model chip row, hit cards with their passage and a switch for agents' conversations; version 5's Search window (search.search) has a box, chips of the models in the last answer, hit rows opening the window of the row they name, the total and the no-hit line | built, tested in searchWindow.test.js |
| W2 | Version 5 screenshot | The journal search find command and its base pieces (Model.search_fields, ContainsEvery) land in this branch only at the next rebase, so the demo cannot run the window yet; search-v5.png follows then | open until the rebase |
| W3 | Also search the agents' conversations | Version 5's search reads rows only | no data; no task gives it yet |

| D | Dumps | The window listed a title and a brief; now a card for each dump with its items, each with New, Noted, Filed or Failed, the note or summary the agent left and what it was filed into (DumpRows). Dropping text and files stays in the chat's Dump files form. Task 5938 ported what needs no backend: the open dump's head with a Filing or Filed pill and a rename while it is filing, a bar of the files settled, the rows made with their type and the file each came from, and earlier dumps as one line that opens on a click (tests/dumpWindow.test.js). Still missing, each needs a backend change first: adding or dropping files in an open dump, the agent's log and questions, the report's summary and offers, stopping and removing a dump, renaming a closed dump | windows/dumps-v4.png (version 4, no dumps on the environment), windows/dumps-window-v5.png (the window with a dump filing and one filed) | partly |


| C | Composer | The corner button was Dump files and a disabled Send side by side; now one button, Dump files while the box holds no text and Send as soon as something is typed, as in version 4 | composer-empty-v4.png, composer-empty-v5.png, composer-typed-v4.png, composer-typed-v5.png | fixed |

Open after this pass: the New plan, New document, New check, New sequence and New trigger buttons (each needs a create form), the Run button on a check, the plugin install field, and grouping tasks by plan and phase (a task row names no plan yet).

## Plan dock cards (task 5498), pair plandock-v4.png, plandock-v5.png, plandock-v5-folded.png

| # | Item | Difference | State |
|---|------|------------|-------|
| P1 | Plan cards in each state | The demo chat shows one card each for started, paused, cancelled, done and waiting for you (the plans seeder, the plan dock types) | fixed |
| P2 | Card follows the scroll | Cards fold when the chat is scrolled up away from its foot and open again at the foot, and fold when the chat is short, as version 4 | fixed |
| P3 | Fold by hand | A fold sign on each card folds or unfolds it, and the card keeps that against the scroll | fixed |
| P4 | Version 4 plan card buttons (Approve, Ask for a critique, Open plan) | Only Open is drawn on a docked plan | open |

## Docked process (task 5499) and docked card text (task 5489), pair procdock-v4.png, procdock-v5.png

| # | Item | Difference | State |
|---|------|------------|-------|
| R1 | Process dock | A process mark's Dock button adds the process above the composer; its card shows the state and the last lines of its reader, read again every two seconds while it runs, with Stop and Stop watching; the demo docks its running process | fixed |
| R2 | Docked card text | The description sat 44 pixels in, past the title; now it lines up with the title text, the gap below it unchanged | fixed |
| R3 | Dock bodies | A body read as a window no module declared, in no environment, so none could read; it now reads as its type's window in the environment of the chat | fixed |
