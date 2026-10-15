# Version 3 against version 4: what behaved differently

A report for reading, feature by feature, on how version 3 behaved and what version 4 does today
(2026-10-15, branch `version-4`). "Same" means the base behaviour is there; "partly" means the base is
there with pieces missing; "missing" means version 4 has nothing for it yet. The research behind it was
done by two read-only agents over `v3.bak` and by this session's own work on version 4. Code is not
described here; the companion `docs/messaging-and-chat-marks.md` holds the exact messaging rules.

## Part one: the agent side

### How the journal speaks to the agent

| Version 3 | Version 4 today |
| --- | --- |
| Every line starts with `[journal]` and is an instruction, never a message. Lines are batched, at most one every five seconds, merged into counts ("3 new messages 314, 315, 316"). | Same mark and meaning. **No batching**: each line is typed on its own, at once, one after the other. |
| A line that asks for action repeats every five minutes until acted on; a newer line on the same thing, or the subject going away, ends the repeats. | **Partly.** A nudge has a repeat window (so it is not said twice within it), but nothing repeats a line that was ignored. |
| An agent reply to a journal line that changes nothing ("Noted") is kept and hidden from the chat; answers to the user, questions, failures and turns that changed files always show. | Same, built today: hidden when the prompt was a journal line, no file was written, the turn is short and the nudge did not ask for words in the chat. |
| Chat etiquette: every 50 journal lines a reminder; third person, shop talk and em dashes pointed out. | Partly: third person, shop talk, em dashes and run-together paragraphs are pointed out. **No periodic reminder, no bare-number nudge.** |

### Lifecycle and status

| Version 3 | Version 4 today |
| --- | --- |
| Statuses: stopped, idle, busy, working, compacting. The hook sets idle or busy; "working" only while a piece of work is declared and not parked. | Same since today: hooks give busy, "working" only in the working or following-a-plan state, which `journal task start` enters. |
| The viewer's words: Working, Waiting, Busy, Paused, Idle, Not responding; status lines "to-do N · title", "ready for the next to-do", "ready for your next message", "no agent is on this environment", "compacting the conversation". | Partly: idle, busy, working, stopped and compacting reach the viewer; **waiting (awaiting), paused and "not responding" do not**, and the status line does not name the task's title. |
| Liveness: a session silent for 60 minutes is marked stopped; a silent subagent's to-dos come back after 20 minutes. | **Missing.** A session that never sends its end hook stays live for good. |
| Eviction: a second session on a busy environment waits in one of its own and the user is asked to take over; the evicted session's writes are held. | **Missing.** Several sessions on one environment; the most recent is "the" agent. |
| Only the user starts an agent; `wake_on_message` can start one when a message arrives and none runs. | Missing: no starting from the viewer, no wake on message. |
| Put-off work: "later" in words without a to-do is pointed out once. | Missing. |
| Long commands: moved to the background after 30 seconds, told when they end, told when they show nothing new for five minutes. | Built as the shell runner: every chained command is run part by part, each recorded with its output and duration; a part past 30 s (10 s while a message waits) moves the rest of the chain to the background and the agent is told when it ends. No five-minute quiet notice. |
| Heavy runs: one queue of test runs per project. | Missing. |
| Polling guard: the same check run again and again is pointed out. | Partly: the same command three times is named. |

### Work and the write gate

| Version 3 | Version 4 today |
| --- | --- |
| One piece of work at a time: `work start`, `work log`, `work end --how`, `work park`, `work resume`, `work await`; `todo start`/`todo done` on rows. A second start is refused until the first is ended or parked. | By the user's ruling of 2026-10-16 there is no work command: a quick edit needs no task and is never refused; `task create --start`, `task start`, `task log`, `task done --how`, `task park <n> "<why>"`, `task resume <n>` and `task await <n> "<what>"` carry the rest, and only one task is in hand at a time. |
| Holds, each with its exact line: no work declared; log overdue after 20 edits; after compaction read the latest messages; skill not loaded; context mark; unread messages after five reminders; unanswered message after ten tool uses (every tool call); choices offered in prose; a sequence step handed; a trigger hold or deny; eviction. | Partly: skill not loaded, context mark, sequence step, trigger deny, log overdue (fifty edits), unread (five reminders) and unanswered (fifteen tool uses) holds are there; the no-work hold is gone by ruling. **Missing: read after compaction, prose choices.** |
| `journal stuck "<why>"` quiets the carry-on nudge until the next tool use or prompt. | Same. |
| Laws refuse a subagent without a model, without a job, or one that can write; a whole read of a long file is refused. | Partly: no model and no job are refused; **a writing subagent is not refused; a long whole read is named, not refused.** |
| Work lines: "work N is still open" at a stop, "work N in hand" every ten edits, parked work asked after, awaited things asked after every five minutes, blocked rows re-asked. | Partly: a stop with work in hand is told to carry on. The rest is missing. |

### Session start

| Version 3 | Version 4 today |
| --- | --- |
| A start block: the journal is in force; handle it quietly; a takeover notice; the voice; the laws; the work mode; the skills to load now; what waits for the agent by type. The same again after compaction. | Partly: the briefing says the journal is ready, the skills to read, the voice, and the unread messages. **Missing: the quiet rule in the block, the takeover notice, the laws in the block, the work mode, the counts of what waits.** |
| Skill gate: every tool call waits until the journal skill is loaded; after 25 tool uses in a fresh window a reload is asked; a changed skill is named; keywords load a skill; a command needing a skill owes it. | Same base: loading is held for at start and when entering a state; keywords require a skill. Missing: the reload after a fresh window, the stale notice, the step-aside after five refusals. |
| Greeting: "the journal is ready on env / say hello in the chat". | Same, extended today: a fresh conversation opens with the agent introducing itself in its voice. |
| Profiles: researcher, planner, debugger written as agents. | Same. |
| Voices: Butler, Homie, Colleague, Coach, Squire; title and first name; a change reaches the running agent at once with one sentence in the new voice. | Same. |

### Memory at context marks

| Version 3 | Version 4 today |
| --- | --- |
| At 50, 70, 90 and 95 percent: decide (fact, rule, or nothing) before any other write. | Same base, at the marks the statusline reports. |
| Weekly reread of every rule and fact. | Missing. |
| A rule just made is questioned once ("binds every environment?"); only the user strikes a rule. | Missing. |
| Keyword whispers: a fact, rule or reminder whose word appears is whispered once with the next line, and shown in the chat as a mark. | Missing. |
| Standing facts, reminders and rules named at each report cycle. | Partly: given at start. |

### Nudges, pacing, auto mode

| Version 3 | Version 4 today |
| --- | --- |
| Auto mode offers the next ready row on idle; stopping with work open is told not to stop (at once in auto, after five quiet minutes otherwise); carry on after 15 quiet minutes; check in every 30 minutes; nothing ready every 10 minutes; next while waiting or while a helper works. | Partly: the stop with work in hand is told to carry on at once. **No auto/ask mode setting, no next-row offer, no check-in, no nothing-ready line.** |
| Work modes builder, orchestrator, solo, with drift nudges. | Missing. |

### Questions, plans, sequences, checks, triggers, helpers

| Version 3 | Version 4 today |
| --- | --- |
| Questions: options with the agent's pick, refused without one; provider question tools refused and filed instead; a pick held three seconds to undo; "elaborate"; dismissal after a day. | Partly: ask with options, the answer typed back, the pause while waiting. **No pick, no refusal of the provider's question tool, no undo, no day-old dismissal.** |
| Plans: create, phases with checkpoints, to-dos per phase, ready, approve by the user, start, park, delegate, review by report; stalled-plan lines. | Partly: a plan of ordered tasks followed to its end. **No phases, checkpoints, approval, review, park.** |
| Sequences: run, follow, next, abandon with reasons; nesting; starts_on; system sequences. | Partly: run, follow, next; back to where it began. **No abandon, no starts_on, no system sequences.** |
| Checks: command or instruction checks, every N minutes, touched, gate with commit on pass. | Partly: command checks on the clock, failures typed and carded. **No instruction checks, no touched, no gate.** |
| Triggers: words in text, commands or both; does nudge, instruct, message, hold, deny, start; fact-state triggers. | Partly: words and actions nudge, hold, deny. **No message, no start, no fact-state triggers.** |
| Helpers: dispatch to a provider with a model and a brief, worktree or checkout, say, finish, stop, peers, idle and quiet lines, caps. Subagents only read; a writing subagent is lent an environment. | **Mostly missing.** Workers are recorded and awaited but never spawned. |

### Commits

| Version 3 | Version 4 today |
| --- | --- |
| `Journal: todos done N` on its own line closes the to-do when the commit lands; every commit is a card with hash, branch and subject; branch switches are marks. | Partly: the commit card. **No closing by trailer, no branch-switch mark.** |
| A to-do named in a reply within five minutes is linked to the message; an unlinked one is pointed out. | Missing. |

## Part two: the viewer

The viewer is version 3's, unchanged, so every difference here is in what the version 4 server
answers it.

### Home

| Version 3 | Version 4 today |
| --- | --- |
| A message you sent shows Sent, then Delivered when the agent has read it, then Processed once it is closed. | **Wrong:** a read message shows Processed at once, because version 4 reports a read message as closed. It also counts as closed for paging and for the "Filed from your message" receipt. |
| Sending: the message appears at once as a placeholder, is retried every five seconds until the server takes it, and the header says "not sent yet, trying again" meanwhile. Attachments are uploaded after it. | Same for text. **Attachments never upload** (no upload route), so a message with a file retries for good. The "Not sent" you saw came from the server failing under the descriptor leak, fixed today. |
| The chat draws: messages, replies, reactions, receipts, questions, suggestions, and marks for skills loaded, compactions, thoughts, whispers, cards, subagents and documents the agent made. | Partly: messages, replies, reactions, questions, cards (commits, checks, triggers, questions answered, halts), subagent marks. **Missing: skill-load marks, thoughts, whispers, suggestions, receipts, documents made.** |
| The status line under the agent: Working, Waiting (with what it waits for and for how long), Busy, Paused, Idle, Not responding; the current to-do's title. | Partly: Working, Busy, Idle, stopped, compacting. **No Waiting, Paused or Not responding; no to-do title.** The pause and resume buttons answer with a server error. |
| The working bubble shows the agent's live thinking, else the bar's line, while it works. | **Rarely shows**: no thinking is reported, and the bubble only draws for Working, which now needs declared work. |
| The bar under the top bar plays status lines made from the agent's commands. | Same base, from tool entries. |
| File edits pane: one card per edited file with the changed lines, folds between distant edits, older edits on request, the full file before and after, images. | Partly: cards with changed lines. **Wrong folds between edits of one file, no older edits, no images, no context lines.** |
| Terminal pane: the agent's commands and output, filterable by verbosity, and a command line to type into the agent. | Partly: commands and output. **No verbosity, no typing into the agent.** |
| Activity rail: one line per event with a label per type and action ("Message read", "Task closed", "Linked…"), the tool and hook on agent updates, settings changes refreshing the page. | Partly: created, updated, deleted and agent updates. **No closed, linked, commented, reopened; agent updates have no tool or hook subtitle; a setting changed by the agent does not refresh the page.** |

### Agents

| Version 3 | Version 4 today |
| --- | --- |
| The agent bar shows provider and model, effort, context used with the last compaction, running since, branch, counts of subagents and shells, plan usage, loaded skills, model and effort picks that wait for the turn to end, appoint another session. | Partly: provider, context, started, skills. **No model, effort, usage, branch, counts, picks or appoint.** |
| Start and stop an agent from the environment list or the hub; remove, sweep or unarchive an environment. | **Missing.** Agents start only from the terminal. |
| An environment "asking" shows a question waiting. | Same. |

### Pages

| Version 3 | Version 4 today |
| --- | --- |
| Every list has open, closed and updates tabs, and every row can be closed with its own word (done, answer, strike, retire, archive…), reopened, deleted, updated, sectioned, prioritised, marked read, restored. | Partly: tasks, questions, facts, rules, reminders and plans have their main acts. **No sections, priority, restore, or generic update; no create or acts for docs, reports, sequences, triggers, checks, collections.** |
| Tasks: grouped as blocked, parked, planned, waiting, started, asked, open; a board of lanes. | Partly: the list with status and rank. **No board, no lanes, no blocked, parked or waiting groups.** |
| Plans: a card in the chat and bars in the status bar; building, draft, ready, reviewing, approved, active, waiting, parked, done; approve, continue, finish, park, abandon, make from a document. | **Broken label**: a running plan reports a status the viewer does not know ("started"), so it drops out of the cards and bars. Only park and start exist. |
| Documents: a library with search, revisions, keep, download as markdown, locate by words. | Partly: the library. **No revisions, keep, download or locate; the body is one block, not sections.** |
| Reports: a dock in the chat, open, updates and closed filters, dismiss, archive. | Missing beyond the list. |
| Sequences: steps shown and edited; runs per row with the current step. | **Steps do not show**: the server sends them in the wrong field, and no runs. |
| Triggers: the editor with words, where they match, what it does, timing, matched-at; test a text. | **Only words and the action reach the editor.** |
| Checks: last result with time and output, running with progress, history; run now. | **Every check reads "Not run yet"**: the result is sent under the wrong names, and "run now" is missing. |
| Settings: the whole tree, every feature switch, work mode. | **Breaks after the first toggle**: the server answers a toggle with only the changed keys instead of the whole tree, and the page then loses its switches until a reload. |
| Journals hub: every journal on the machine with its environments, agents, counts, plans; start or forget a journal. | **Totals come out as NaN**: the summary lacks message, suggestion and to-do counts. No start or forget. |
| Code: the project tree, a file's text and diff, find, a commit. | **Clicking a file errors**: no file, diff or commit routes; find always empty. |
| Collections, skills page, phone app, sharing, plugins, integrations, secrets. | Missing. |

### Listing and events, the contract underneath

| Version 3 | Version 4 today |
| --- | --- |
| "Give me these rows" (`n=1,2,3`) and `by=updated`; `closed=1` means closed too; a catch-up page since an id includes deleted rows so the viewer can drop them. | **`n=` is ignored** (a normal page comes back), `by=updated` ignored, deleted rows never sent, so a deleted row lingers on a page holding more than 25 rows until a reload. |
| Actions on an agent are keyed by its session id. | **A server error**: the route parses the session as a number. |

## Where it stands after the drain (2026-10-15, night)

Done from the lists above, agent side: one task in hand with park, resume and await; the log-overdue hold and
the task named every ten edits; the unread, unanswered and after-compaction holds; silent sessions ended
after an hour; the start block with the quiet rule, the laws, a takeover notice and what waits; auto mode's
next task at a stop and the check-in; keyword whispers; the fresh-rule question; a task named in a reply
linked to its message; commit trailers finishing tasks; the provider's own question tool refused; the
etiquette reminder every fifty lines; workers that run and report. Viewer side: every item of the
fix-first list through nine, attachments, the Code page, labelled activity, model and branch on the agent,
real line numbers in the edits pane, typing into the terminal pane, parked tasks, documents with sections,
the generic acts, plans finished, environments removed, checks run, sequences edited, triggers edited, the
skills page, starting and stopping agents from the viewer with one inbox per environment.

Left, by choice, for a later round: eviction and take-over of a held environment; work modes and the drift
nudges; heavy-run queues; the weekly rule reread; choices offered
in prose turned into a question; bare numbers named; plans with phases, checkpoints and approval; sequences
abandoned or started by a trigger; instruction checks and gates; triggers that post a message or start a
sequence; helpers said to and finished with caps; the tasks board with lanes; document revisions; the report
dock; collections; the transcript pane; the phone app and sharing. Thoughts in the working bubble cannot be
had: Claude Code omits its thinking from the transcript.

## What to fix first

In the order that unblocks the most of your day to day use:

1. Settings: answer a toggle with the whole tree. (One line, breaks the page today.)
2. Messages: a read message is read, not closed; "Processed" only when closed. Read ticks then behave.
3. Plan status "active" instead of "started", so plans show again.
4. Checks and sequences: send `last`, `running`, `runs` and `sections`, so pages stop reading empty.
5. The summary's counts (messages, suggestions, to-dos), so the hub stops showing NaN.
6. Agent routes by session id (pause, resume, control, shell), and the file, diff and commit routes of the Code page.
7. The listing keys `n=` and `by=updated`, and deleted rows in catch-up pages.
8. Status line: waiting, paused, not responding, and the to-do's title; the working bubble with thinking.
9. Starting and stopping an agent from the viewer.
10. The agent side, by the order of part one: work park, resume, await; the holds that are missing; liveness; the start block; helpers.
