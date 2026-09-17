# Changelog

Newest first. Each entry is what changed, what it makes possible, and what to do about it.
`journal upgrade` prints the entries since the version you had; a session started on a
newer version than the last one it saw is handed the same.

## 1.150.0 — One acknowledgement per message, and a rail you can read

**Either a note or an answer, never both.** The journal wrote "Noted — created to-do 4." under a
message when it was filed, and then the agent replied in its own words: one filing, told twice,
which is what the user saw all evening. The note is no longer written into the record at all — it
is read off it when the chat is built, so a reply that lands after the filing simply replaces it.
The two share one key, so the swap patches the same element in place instead of animating one out
and another in.

**A reply says what it is replying to.** A reply with nothing quoted read as a turn the agent
happened to take; it quotes the message it answers now, and clicking that quote moves the thread
to it. And a plain reply no longer raises a notification — the thread shows it in place, so the
notification was a second telling of what was already on the screen. A reply that answers a
`--part` still raises one: it closes a question, and the row it answers is somewhere else.

**The rail is readable.** A notification wraps instead of ending in an ellipsis before it says
what happened, with its age pinned to the top right; the kinds that want something from you — a
question, a plan, a report — carry their colour on the left edge and the rest stay plain. Blocked
sits under In progress and over Open, on the page and in the tab alike, off one list. The rows
arrive and move the way the cards in Waiting on you do. A bar at the foot of the notifications tab
marks them all read.

**Smaller.** Every age is abbreviated — `1m ago`, `2h ago`, `3d ago`. The branch in the status bar
opens the repository when the remote has a web face, and stays plain text when it does not. Up
arrow in an empty chat box brings back the last message to edit. A blocked to-do says on its status
line what it is waiting on. `journal settings` with nothing to set is a read again, so the gate no
longer refuses the listing while no work is declared.

## 1.149.0 — An event belongs to an environment, and a message gets an answer

**An event goes to whoever works the environment it belongs to.** A session that had chosen no
environment was handed EVERY environment's traffic. That was written when being unbound was a
rarity and left in place when 1.145.0 made it the state every new session begins in — so the
rare leaky case quietly became the ordinary one, and a message left on one environment woke an
agent with nothing to do with it, which then read and acted on somebody else's instruction. A
session on no environment is now told that something waits THERE and that it has not chosen;
the event stays untold for whoever picks that environment up.

**A push says what arrived, and quotes nothing.** Every line carried the first two hundred
characters of the thing it announced — and the agent's next act is to open that thing and read
all of it. A partial copy of something about to be read in full is worse than none, because it
can be acted on as though it were the whole.

**The journal answers a message when it files it.** A became-pill in a message's header is a
pointer, and a pointer is not an answer; a user watching their messages get filed with nothing
said back cannot tell reading from ignoring. The journal now writes one line under the message
itself, in its own voice, naming what it became — and stays silent when the agent has already
replied properly, because a receipt under a real answer is clutter.

**A row named in a sentence is a pill you can open.** `to-do 183`, `pin 4`, `rule 2`, `doc 3`,
`report 5`, `reminder 7`, `message 12`, `question 8`, `plan 5`, `suggestion 2` — anywhere in a
turn, a brief, a comment or a doc. They open the inspector rather than navigating.

**A name used again inherits nothing.** `remove` was leaving `viewer_first`, `session_marks`
and the to-do ledger behind. The other half could not be deleted at all: the chat reads the
marks in the TRANSCRIPTS, which this package does not own, so a reused name always found every
stretch any session spent on a name like it. An environment's conversation now starts when the
environment was made — a boundary rather than a deletion.

**Smaller.** A to-do that is waiting says on what, in the list. The rail's heading is a bar with
its text centred and a rule under it. "Working on" holds the left of a turn's header and the
pills hold the right.

## 1.148.0 — `journal claude` brings the viewer up with it

The viewer is where you work — the messages, the to-dos, the conversation — and it was a
second command you had to know about and remember. `journal claude` starts one now if this
journal has none, and says where it is; if one is already up it says that and starts nothing.
It is detached, so it outlives the session that started it — and it has to be here for a
second reason, since `journal claude` execs into Claude Code and a child of that process would
not survive the call that replaces it. `serve --detach` and this are one funnel.

**A line printed just before that exec used to vanish.** `execvp` replaces the process image
without running any of Python's teardown, so whatever was still in the stdout buffer was
discarded — which is why the line saying the channel had been installed never reached anyone
who was not on a tty. Reproduced with a stand-in for the `claude` binary, and fixed with a
flush before the exec.

## 1.147.1 — The rail's section heading is a bar

1.147.0 fixed the rail's gutter and left the vertical alone, so a section heading was still a
line of text with six pixels under it and nothing above — a section opening with a word rather
than with a division. It is the same bar every list page uses now: a fixed height with its text
centred in it, a raised ground, and one rule along the bottom that does the separating. The
sections gave up their own top border and margin with it, which were doing that job twice.

## 1.147.0 — What the audit found, fixed

Two agents read the code and reported; every finding below was reproduced or measured before
it was touched, and one of them was worse than reported.

**THE LOCK DID NOT EXCLUDE A SECOND THREAD.** `state.locked()`'s reentrancy counter — the
thing that lets a caller who already holds the lock call a helper that takes it again — was
one counter for the process. A second THREAD read it, saw a non-zero depth, took the "already
held" branch and entered the critical section without ever touching the `flock`. Measured: one
thread held it for a second, another entered 0.21s later. The one process where that matters
is the one built for concurrency — the viewer is a threading server, and every write endpoint
it answers goes through that lock. The counter is thread-local now.

**A TO-DO'S NUMBER WAS NOT UNIQUE UNDER CONCURRENT WRITERS.** Reading the counter, deciding
`n` and writing the file were three unguarded steps. Twelve threads adding at once produced
twelve files under TWO numbers, eleven of them sharing 001 — both callers of every collision
told they had succeeded, and every `todo:1` reference ambiguous eleven ways. `assign` had the
same shape, so two agents could both be told they held one row. Both take the lock now, the
counter is written atomically, and both are tested with real threads.

**The bindings file is written atomically.** `tracks.bind`, `unbind` and `prune` truncated and
rewrote `runtime/bindings.map` while `current()`, the channel and the viewer all read it
without the lock. A reader landing in that window parses nothing and every session in the
project reads as unbound for that instant. The atomic write is public now — `state.write_json`
— and the three other hand-rolled JSON writes go through it.

**The hook stopped paying for a registry it rarely uses.** `import commands` sat at the top of
`hook.py` and pulled in every command module; the two places that read the registry both bail
out unless the tool is Bash. Measured end to end on a Read, twenty-five runs each: 72.6ms
before, 58.9ms after.

**In the viewer.** A turn with no text — a message that is only an attachment — threw inside
the watcher that follows the thread, three times a poll, after which nothing scrolled to a new
turn and nothing counted what was missed. `ReportPanel` and `ReportDetail` were the same
component written twice and had already drifted; they are one now, which was the last place
the one-panel-per-resource rule was broken. A to-do in a plan's phase can be opened from the
keyboard. Eighty-eight lines of dead CSS and one unreachable icon branch are gone. And the
rail has one gutter that its heading, its cards and its rows all keep to, instead of a heading
flush at zero above cards inset sixteen.

## 1.146.0 — Connections have a page, and a reference opens where you are reading

**The connections page.** 1.145.0 gave the project a list of the services it can reach; this
is the page for it, under Environment, because what it shows is THIS environment's reading of
that list with its own changes applied and each one marked beside the project's value. It is
read-only on purpose: a connection is written from the terminal, where whoever types a variable
name can see which shell they are in. What crosses the wire is the variable's NAME and whether
the SERVER has it set — never what is in it, because the viewer is the one place a secret could
be shown to somebody who is not at the terminal.

**A reference to a pin, a rule or a reminder opens in place.** Three kinds were navigating to
an index page, for two reasons stacked on each other: a reminder's link was built as the LIST,
throwing away the number the reference already carried, and none of the three had a panel
registered to open into. Both are fixed at the source, which covers every chip in the viewer at
once — the thread's became-pills, a comment's, a question's links, a part's.

**A rule has a panel, and so does a pin and a reminder.** A pin and a rule are one shape with
two scopes, so they are one factory and two names; the Pins and Rules pages now render the same
component the inspector does rather than a second copy of it. The same for reminders.

Also: what a message became is deduplicated — two parts that became the same row drew the same
pill twice. And `for` became `purpose` on a connection, because `for` is a keyword everywhere a
field becomes a name; the CLI still answers to `for`.

## 1.145.0 — There is no default environment

**READ THIS ONE BEFORE UPGRADING.** `tracks.current` used to fall back to the project's
start environment whenever a session had not chosen, so that a READ never needed a decision
first. The cost was that the start environment WAS a selected environment: a fresh session
read its pins, its to-dos and its work as its own, and nobody had been asked.

It is gone. A session that has picked nothing is on no environment, and the journal refuses
— reads as well as writes — naming the environments there are and how to pick one. What
still answers unbound: `environments`, `switch`, `prepare`, `claim`, `rules`, `docs`,
`tools` and the machinery. A `--continue` or `--resume` goes back to the environment that
session was last on, remembered on every hook event now rather than only at a clean exit, so
a session that was killed still lands where it was. `bind_on_start: true` in settings is a
project saying every session belongs on its start environment, and puts the old behaviour
back in one line.

Two things deliberately unchanged: a process that is not a session — the viewer's server, a
test harness, a hook with no transcript — still reads the start environment, because nothing
there could ever be asked to choose. And `tracks.start(root)` is that environment as its own
named question, so the two can no longer be confused for one another.

**An event has a kind, and the kind decides whether it interrupts.** The channel's gate was
one bit: an idle session heard everything the user did in the viewer and a working one heard
nothing, so the user speaking and a setting being changed carried the same urgency.
`channel_reach_now` lists the kinds that reach a session mid-turn, and defaults to the user
speaking — a message, an answer to a question the agent asked, a comment on what it wrote.
Everything else waits for the next stop.

**Work the agent set aside is a turn you can answer.** Parking is the agent saying it cannot
go on without you, and it said so where nobody looked: the home filters parked work out of
its open-work list, so "the PR is ready, do you want me to merge it?" sat in the record while
the thread carried on. It is a turn now, carrying the work it holds and a button that opens
the box with the ask attached. It is in the rail too, counted, and undismissable — as a
question is, and for the same reason: nothing else would bring it back.

**`journal connections`.** Services the project can reach, kept as a list the project owns,
with each environment's disagreement recorded as a patch of fields rather than a fork of the
list — so nothing exists only on one environment and what it overrode is readable beside what
it changed it from. THE SECRET IS THE NAME OF AN ENVIRONMENT VARIABLE, NEVER THE TOKEN: this
record is read back verbatim into every session and subagent, so a value with the shape of a
token is refused where it is typed, and the only question the record answers about a secret is
whether that variable is set in this shell.

**In the viewer.** A question's rail card has no dismiss control — a question goes nowhere
until it is answered, and dismissing it hid it in that browser with nothing to bring it back.
A turn's header stopped eating the bubble: `.md > :first-child` zeroes a top margin and comes
later in the sheet, so the negative margin that was meant to pull the header into the padding
was silently dropped, twice. The reply chip is small again. The rule above the writing box
runs the whole column instead of stopping short at both ends.

## 1.144.0 — The home is a chat

The viewer's home is a conversation now. Everything the agent says to you and everything you
say back is one thread; what the agent DID stays in the Activity column, where it always was.

**The thread.** Its turns come from `GET /api/env/{env}/chat`, which reads the agent's tagged
replies out of the transcripts and your messages, replies and questions out of the journal.
The filter is not a heuristic over the activity log — it is a different source, so nothing
the agent did has a path into the conversation. A question is a turn you answer in place; a
message says what it became and whether that row is being worked; attachments sit in the
bubble with pictures shown; delivered, read and filed are three ticks, and the third names
what the message turned into.

**Replying quotes what it answers.** Tapping a turn starts a reply that carries it, and
`journal messages reply <n> --quoting="<words>"` is the same act from the terminal. The quote
is checked against what was really said in that thread, so it cannot be invented — the same
guarantee `--part` already gave in the other direction, kept separate because the two check
against different sources.

**What is not a turn sits beside it.** Waiting on you, the plan and what is finished share a
rail; clicking one moves the thread to the turn that raised it rather than opening over it.
The agent's own facts are a slim bar with its subagents folded into a count, because a list
that grows must never push the conversation down.

**Two things it got wrong before this release, in case you saw them.** The thread read only
LIVE sessions, so it kept every message you wrote and silently lost everything the agent said
when a session ended, switched environment or went stale; it reads every transcript now, by
the marks. And each poll re-parsed the whole file; it reads only what was appended.

**`journal plans phase` can insert.** `--before=<p>` puts a phase where it belongs and the
phases after it move along with their to-dos and their checkpoints. Append-only cost this
project a plan that had to be abandoned and rewritten.

**`journal work park` is documented, with what it is for.** Being stuck, or doing something
else in the meantime — never a way to wait for an answer the work itself could have asked by
producing a draft.

## 1.143.0 — A transcript is a thing you send, and what the viewer owed you

**A transcript is its own kind of thing now.** Send one — `journal messages add "<it>"
--kind=transcript`, or the message box — and that word is the instruction: the agent reads it,
separates what was decided from what was discussed, researches what it names, files the to-dos in
your own words, and PROPOSES a plan that waits for you. The `journal-transcripts` skill says all of
that in one place; `journal-messages` used to carry half of it.

**The transcript itself is a file, not a document.** It is written to
`environments/<env>/transcripts/<n>.md`, its front matter naming what it is and which message carried
it. The document catalogue scans a different tree entirely, so a transcript is invisible to it
structurally — nothing filters it out and nothing can drift. No menu lists one; it is reached from
its message, or served at `/transcripts/<env>/<n>`. Pruning the message takes the transcript with it,
pasted or attached alike.

**What a transcript produces points back at it.** `journal todos add --transcript=<n>` marks a row
and `journal plans link <n> "transcript 25"` links a plan, both checked — a message carrying no
transcript is refused, so a tag can never point at nothing.

**And if you forget to declare one**, the agent recognises what is unmistakable and says so rather
than filing silently; `journal messages declare <n> transcript` then makes it real, even on a message
already processed, because recognition happens while filing.

**The viewer stops re-sending what you already have.** It polls every five seconds, and a listing
carries every row in full — 499 KB across 414 messages on a real project. Listings are fingerprinted
now and answered 304 when nothing changed: half a megabyte becomes nothing, sixty times a minute,
and the page cannot tell the difference.

**A file is read where you found it.** A document's attachment used to open as raw text in a browser
tab. It opens over the page now — markdown rendered, images shown — and the inspector, capped at
560px, can be dragged to most of the window.

**Fixes for things that were plainly wrong.** A message you just sent no longer lands under
"Handled". An inspector never navigates away to a list — it swaps in place. The home's Finished
section shows the newest work rather than the oldest, which had it stuck for hours. A reply with no
quoted part now reaches you at all, and the reply inspector shows the reply rather than the message.
A part that became plain `work` no longer opens a not-a-number page. Pins and reminders are back in
the navigation. `messages search` works again — it had quietly lost its verb since 1.126.0.

**The channel nudges an idle agent back to work**, but only with auto mode on, only past
`idle_nudge_minutes` (10 by default, 0 to turn it off), and only while something is actually ready.

## 1.142.0 — Pasting a transcript, and what is waiting on you

**Paste a transcript and the journal files it.** A pasted meeting transcript or summary arrives as a
message with the transcript attached as a file; the agent splits it into verbatim parts, files the
to-dos it finds, and DRAFTS anything that reads as a plan rather than starting it — a to-do is a
correction away from right, a plan is a commitment. The transcript stays a message attachment,
outside the document catalogue and never handed to a session, and becomes citable only by being
promoted into a doc. An excerpt must be the user's own words, so a summary the agent wrote cannot be
filed as something they said.

**Each kind waiting on you reads as its own card.** The home queue was a uniform row per item: a dot,
a title, an age. Now every waiting kind is a card carrying the kind's own colour on its left edge,
with the one thing to do with it named underneath. A question is weighted heavier than the rest, a
report reads as something to open, and a plan waiting at a checkpoint is a card among them rather
than the one odd row out. The card always names the item — "report 2 · 2d ago" — because the number
is the handle on it.

**A report has a page of its own.** Reports moved out of Documents into their own entry, and a report
can now be read full width at its own URL the way a document can, not only in the inspector.

**A part records which environment its ref lives on.** A message part stored a bare reference to what
it became, and `plan:1` exists on every environment that has one — so the link from a message to the
plan it produced was invisible whenever the two sat on different environments, and searching every
inbox for the bare reference would have found the WRONG plan rather than merely been slow. The
environment is stamped on the part when it is processed (`--in=`), and the link points at the
message's own environment.

**A plan's title, goal and approach can be corrected.** `journal plans edit` reworks a plan that is
still being written, so a goal opened as a placeholder does not have to be lived with or rebuilt. A
plan cannot be declared ready while a phase is empty, so the user never sees a Start button on
something the agent is still filling in.

**A question waiting on you is not a reason to stop.** With auto mode on, an open question parks the
row it belongs to and the agent carries on with the rest of the list instead of idling until the
question is answered.

## 1.141.2 — Four fixes found by using it

Every one of these turned up while shaping a plan with the user rather than by looking for them.

**A pruned message takes its files with it.** Dropping a message's content popped `text` and `files` from
the record and stamped it removed, but nothing unlinked the bytes — every attachment ever pruned stayed
on disk with nothing pointing at it. The deletion is targeted: the suite proves a pruned message's folder
is gone while a neighbouring message's is untouched.

**`plans add --preparing` says what it stored.** It announced "(draft)" while storing `preparing`, wrong
at the one moment the writer reads it — and it made a plan being shaped look approvable. A preparing plan
now gets the sentence that matters with it: nobody can approve it until `plans ready`, which refuses while
a phase has no to-dos.

**A report can answer a plan or a doc.** Rule 9 sends dispatched research back as a report, and the
commonest thing research is for here is a plan being shaped — which `--about` could not name.

**Bare `journal` names a plan being written.** It said "plan: none" while a plan sat there being written,
on the one page that says where things stand. A draft waiting on the user outranks a plan still being
written, because the draft is the one that needs a decision.

## 1.141.1 — The viewer stops waiting, and a stalled plan says so

A user reported that the viewer "just keeps loading" for their colleagues, and another project reported a
plan that stalled in silence. Both are fixed here.

**The page never waits on the network.** `/api/overview` asked whether a newer journal was upstream, and
that check refreshes a cache older than fifteen minutes — inside the page's own request. Where the
repository answers in 88ms nobody notices; where the network drops packets rather than refusing them, the
home sits there with nothing to render. `update.cached` reads what the hooks and the CLI have already
learned and never fetches.

**The home asks for what it shows.** It was pulling every work row and every message ever written, in
full, every five seconds — 986KB per cycle on a real journal — to render a handful of lines and two
counts. Open work now comes from its own small listing, the finished lines and the queue rows from capped
pages, and the counts ride in a row the page already fetches. **986KB to 65KB.**

**A stalled plan names itself.** With an active plan whose current phase holds only rows nobody can start,
`journal next` printed a generic tally and never mentioned the plan — and "nothing to pick up" reads as
settled, so an agent stops while a plan sits stalled on one row. It now says which plan cannot advance,
which phase, how many of its to-dos are held and each one's reason, with the condition quoted. A to-do
also says which plan and phase it belongs to wherever it is listed, and bare `journal` has a plan line.

**A quiet subagent says so.** A subagent that has not called a tool in a while is kept for a day so a long
dispatch cannot vanish mid-thought, but the home strip now says "quiet" in words and lets go after an
hour.

## 1.141.0 — What four reviewers found, and what the viewer owed the user

Four subagents reviewed the previous release — two on the viewer, two on the Python — and this release is
their findings, plus a run of things the user asked for while reading along.

**A self-triggering effect on the home is gone.** The home kept a hand-rolled cache of every plan's
to-dos and guarded it by READING the same reactive key its own fetch WROTE, so every response
re-triggered the effect that produced it. A plan card is now its own component and fetches its own plan
through `useFetch`; the dead Start path it had outgrown went with it.

**One helper decides what a plan is waiting for.** The plan page, the peek panel and the home card each
answered that question in a different vocabulary, and the panel had never heard of a paused or finished
plan. `planPrimary` answers it once — a sentence for the page, one word for the card — and a finished
plan is acknowledged, never abandoned.

**A plan being filled in cannot be declared ready.** `plans ready` refuses while any phase has no
to-dos, naming the phase, so a plan the agent is still hydrating never reaches the state the Start button
belongs to.

**Research ends in a report.** Rule 9, after the user asked twice: work dispatched to subagents comes
back to them as a report the dispatcher writes, because a subagent has no ledger and its transcript is
not something anyone can read. The new `journal-reports` skill says what belongs in one — including what
was found to be FINE, which is most of what a review is worth. A new report waits under "Waiting on you"
until it is opened, and reports and plans now take comments like everything else.

**A subagent that goes quiet stays visible.** Measured: the heartbeat fires on every tool call, so a
working subagent is never mistaken for idle — but the listing dropped anything quieter than thirty
minutes, finished or not, which is why subagents seemed to vanish. An unfinished one now stays for a day
in a state of its own, *quiet*, and a finished one lingers fifteen minutes so its line is there to click.

**A compaction says to reload the journal skills**, in as many words, because what crosses it is a
summary of a skill and a summary of a rule is not the rule.

**Also:** a message is the record of what the user said, so a processed one takes a late part and a late
reply — and a MOVED one refuses both, naming where it went; a part can become a report, a doc or a plan;
the status bar carries the branch and the to-do being worked; the message inspector's title is the
message's number, and its answer box appears only once the agent has said something there.

## 1.140.0 — Auto mode is one switch for the whole journal

**Auto mode stops being per environment.** The user watched it fail: an agent that switches environments
came to a halt the moment it moved to one where the flag was off. The switch is the journal's now —
`todo.auto(root)` takes no environment, `set_auto(root, on)` writes one value, and every reader (the
hook's nudges and its `AskUserQuestion` refusal, `journal next`, the status line, plans, the channel and
the controllers) reads that one. A journal that recorded it per environment is migrated on first use: on
if it was on anywhere, because turning it off for someone who had it on somewhere is the failure this
removes. In the viewer the Auto row moves out of an environment's Settings into **Project**, written
through a new project-scoped route, `POST /api/journal/settings`; the environment route refuses `auto`
and says where it lives.

**A plan can be started, paused and read from its own page.** A draft's "Approve the plan" action existed
but was only rendered for an active plan, so the page that shows you the plan had no way to start it; the
band now carries the one act a plan is waiting for — Approve, Pick this plan up again, Acknowledge, or
Continue past the checkpoint. An active plan can be **paused** from its page (parking, in the user's
word), and a plan links back to the message it was built from, the way a to-do, a pin and a question do.

**A question's title is one line.** A title over `question_max_chars` (200) is refused the way a pin's
claim is: the refusal shows what fits, what overflows, and says the context is not cut but moved into
`--description`, with each choice its own `--option`.

**A message is the record of what the user said, not a closed ticket.** A processed message still takes a
late part and a late answer — measured: a plan asked for in a closed message had nothing to link back to,
and an answer that arrived an hour later had nowhere to go. `done` still refuses twice, and an archived
message still refuses everything.

**In the viewer:** the foot of the right sidebar says when a newer journal is waiting, with no way to
click it away until the upgrade; the top status bar no longer repeats the git branch.

## 1.139.0 — A finished plan waits for you, and the viewer says what it means

Everything in this release came from working beside the user in the viewer, one message at a time.

**A finished plan no longer vanishes.** Its card stayed on Home only while the plan was active, so the
moment the last phase closed the plan derived as done and the card disappeared with nothing saying it had
finished. The card now stays under Working on, reading "finished" in the done green — edge, bar and
border — with an Acknowledge button. Acknowledging is the user's act, like approving a plan: the agent is
refused, and `journal plans acknowledge <n>` says so.

**The plan page opens on the plan.** The switcher row above it is gone on the user's word; every plan is
still reachable from the Plans entry in the sidebar.

**In the viewer:** a list group folds when you click its header row, not only its chevron; what a comment
quotes sits above the box as a fixed block instead of being typed into it, so the box is yours; a message
panel is titled with the message rather than with a fraction that counted filed parts as unanswered;
"Nothing is waiting on you" reads at normal weight with a live tick instead of looking disabled.

**Two things that were quietly broken.** The shared progress bar collapsed to nothing in the plan band —
`flex: 1` means remaining width in the home card's row and remaining height in the band's column — so the
bar had no height at all; it keeps its own height now and only grows sideways where that is wanted. And a
new environment starts worked-from-the-viewer, which is where that default belongs: flipping the global
fallback would have turned it on for every environment in every project, including terminal-only ones.

## 1.138.1 — A call through an MCP server is its own line in Activity

A tool call through an MCP server was counted into the summed line — "used 3 tools" — where nobody could
see which server was used or what was done with it. Each server now gets a line of its own, "Used
Playwright", and the calls made through it are appended to that same line rather than piling up new ones.
Clicking the line opens it and lists the calls, one chip each. A line in between ends the run, so the
next call starts a line in its real place, and a project with no MCP servers sees no change.

## 1.138.0 — Work can be parked, plans are their own thing, and the viewer says what it means

A minor release that gathers everything since 1.137.0.

**Work can be parked, not only ended.** `journal work park "<why>"` sets a piece of work aside without
finishing it: it stays open, says what it waits on, and the stop stops nudging it until the first
`work update` picks it up again. `todos ask` and `todos block` park the work of that title instead of
ending it, so nothing reads as Finished that nobody finished, and Home has a Parked section between
Working on and Finished.

**A to-do can wait for a plan.** `journal todos after <n> plan 4` holds a row until that plan finishes,
beside the to-do numbers it already took. When a brief you write names another to-do or a plan and the
row records no dependency, the journal says so and names the command — a nudge, never a refusal, because
a constraint written in prose is one nothing can act on. Auto mode now works an active plan in phase
order, and a phase whose rows are all stuck no longer wedges the list: the next phase is offered instead,
unless a checkpoint the user has not continued past stands in between. A row in the wrong phase moves in
one command with `--move`.

**Everything you do in the viewer reaches an idle agent.** The channel used to wake an agent for a
message, an answered question, a comment, a decided suggestion and a plan approval. It now also announces
every other write the viewer makes, read from the one record each of them already leaves — so a new verb
in the viewer needs no new case to be announced.

**Plans are their own navigation entry**, out of Documents, with their own count of live plans; a finished
plan opens as a plan rather than falling back to the list, and reads as finished rather than as something
to switch to. The journal also ships a `journal-plans` skill: when a plan is worth drafting, shaping its
goal with you first, what a phase and a checkpoint are, and who approves what.

**A message's attachments moved from `inbox-files/` to `message-files/`**, files and all — a migration
runs on the next command. The commit page now reads a commit from the repository when the journal never
recorded it, instead of refusing a link the Activity column itself offered. A commit made by the same
shell call that ended its work is recorded against that work again.

**In the viewer:** pages fade in when they load; a message's parts read as what they became instead of
all reporting as unanswered questions; an inspector's actions sit under the title rather than below the
brief, the log and the comments; Home's Finished section ends with how much more work there is; Add phase
opens a sheet where you write the phase or ask the agent to draft it; a comment records what it produced
and offers it as a button. Eight shared components now carry markup that was written out by hand — among
them one progress bar, so the plan page and Home measure the same thing.

## 1.137.7 — The bell keeps your recent notifications after you read them

The notifications pop-up showed only unread notifications, so a notification cleared by a stray
click was gone from it. It now lists your last 50. Unread ones stay at the top with Open and Mark
read, and read ones stay underneath under a Read heading, with Open, so you can read them again.

## 1.137.6 — Agents are told when a newer journal is out

A newer version was shown to the user at a stop, and reached the agent only with the user's next
prompt. An idle agent, or one working through its to-dos on its own, could go without hearing it. Now
the agent is told once per version, with the command to run: after a tool call while it works, and over
the channel while it is idle. The check still asks GitHub at most once every fifteen minutes for the
whole project, and every notice reads that cached answer. Turning off `update_check` silences all of them.

## 1.137.5 — The channel is used only while the agent is idle

The channel is the fallback for an agent that has stopped: while it works, its hooks tell it about new
messages, answers, comments and suggestions. With auto mode off, 1.137.4 still pushed a message over the
channel to a working agent, so it could hear the same message twice. Now the channel pushes nothing while
the agent works, and everything once it is idle, whatever auto mode is. With auto mode off, an answer,
comment or suggestion still says to handle that item only and not to start on the to-do list.

## 1.137.4 — With auto mode off, answers, comments and suggestions reach the agent too

Since 1.132.4, auto mode off meant the channel woke an idle agent only for a message you left. An
answered question, a comment or a decided suggestion waited for the agent's next stop. Everything you do
in the viewer that is meant for the agent now reaches it again, whatever auto mode is: a message at once,
and the rest once the agent is idle. With auto mode off, each one says to handle that item only and not
to start on the to-do list, which is what 1.132.4 was guarding against.

## 1.137.3 — The sidebar shows the git branch

The Status section at the bottom of the left sidebar now has a Branch row naming the branch checked out
in the project, so you can see where the agent is working. A detached HEAD shows "detached at" and its
short sha. The branch is read from git's HEAD file on every Activity refresh, without running git, and a
project that is not in git shows no row.

## 1.137.2 — An agent's commit is a line of its own in Activity

A commit an agent made showed only on its work page. Each commit made through a shell command while
work is open now also adds an Activity line, "Committed", with the short sha and the commit subject.
It has its own outline in the sidebar, in the accent colour, and clicking it opens the commit. In a
project without git nothing changes.

## 1.137.1 — The user is told on Home when a report is ready

A report the agent files arrived with no notice: it appeared under Reports and nothing said so. Filing one
now also sends the user a notification, "Your report is ready: <title>", shown in Home's Notifications
section and the bell, with Open going straight to the report. A report the user files from the viewer is
their own and sends no notice.

## 1.137.0 — Agents are held for what they owe, not for noise; the hooks stay fast in long sessions

A minor release that gathers everything since 1.136.0:

- **Speed.** The stop and start hooks no longer re-read the whole transcript at every turn: on a 122 MB
  session a stop went from 1.15 s to about 0.2 s.
- **A self-audit, fixed.** Six reviewers looked for ways the journal makes agents behave badly, and each
  finding is fixed with a test:
  - notes that ask nothing of the agent no longer reopen its turn;
  - narrating the next step is no longer taken for putting work off;
  - loop detection, the context gate after a compaction, and the write gate judge commands correctly;
  - a subagent cannot hide a journal write, close a to-do or decide a suggestion;
  - the channel and the stop hook no longer both deliver the same event, and the channel wakes only the
    agent that holds an environment;
  - dropping, closing, starting, moving and retitling to-dos behave as they say;
  - the start block speaks to the right session, and the skills name every hold as it is printed.
- **To-dos.** Done to-dos archive themselves after 7 days, and a to-do number is never reused. The skills
  teach recording which to-do waits on which, and that progress goes in `work update`, not the brief.
- **The viewer.** A Coding style page, and coding style rules generated into skills. Answers to your
  messages read like questions. The work log starts folded, the Skills table scrolls, a skill opens in a
  side panel with quick actions, the sidebar shows the agent compacting, and web addresses in text are
  links.
- **The tests** remove every temporary folder they make; they had filled the disk.

Nothing to do beyond an upgrade.

## 1.136.28 — Web addresses in the viewer's text are links

A web address in the viewer's text now opens in a new tab when clicked: in a work log, a work entry, a
message, a comment and its handled note, and a notification, as well as in markdown bodies, where only
`[text](url)` links worked before. Only `http` and `https` addresses become links; the text around them is
escaped as before, and punctuation after an address stays outside the link. Activity lines and the
notification drop-down, which are links already, are left as they are.

## 1.136.27 — The tests remove every temporary folder they make

1.136.26 was not enough. It removed the projects built by `testkit.make`, but most suites also call
`tempfile.mkdtemp()` directly, for a package copy, a bare record or a transcript, and a full run of the
suites still left 73 folders behind.

Importing `testkit` now points the process's temporary folder at one scratch folder, and removes that
folder when the process exits, so every temporary folder a test makes goes with it. The four suites that
made temporary folders without importing `testkit` now import it. A process whose folders must outlive it,
such as a child that builds a project for its parent to use, sets `AGENT_JOURNAL_KEEP_TMP=1`. A test checks
that a plain temporary folder made in a test process is gone after it exits.

## 1.136.26 — The tests remove the projects they make

Every test scenario built a throwaway project in the system's temporary folder and never removed it.
After many runs there were 47,698 of them, the disk filled, and every command failed until they were
deleted. `testkit.make` now removes the temporary folder around each project when the test process
exits; `cleanup=False` keeps one that a child process builds for its parent to use. Only a `tmp…`
folder directly in the temporary folder is ever removed. A test checks both.

## 1.136.25 — The skills name the holds the way the hook prints them

The core skill tells an agent that has been held to look the line up in its table. Several rows no longer
matched what the hook prints, and some holds had no row at all, so the agent found nothing and improvised.

- The table now spells each hold as printed: "N untagged message(s)", "work still open", "work deferred in
  words, not parked", "N thing(s) in the record have evidence against them". New rows cover work opened by
  another session, nothing on the list can be picked up, the to-dos-waiting note and the recall note.
- The order the stop queue raises things in now includes suggest_hint, recall and cleanup.
- `journal reports keep` archives after 7 days by default, not 30 as the command reference said.
- The messages skill says a decided suggestion also wakes an idle session under auto mode.

A test now fails if a hold's printed text has no row in the skills.

## 1.136.24 — The start block and the open-work hold speak to the right session

- A session on no environment was told, in the same block, to ask the user which environment to use and
  "AUTO IS ON — work the list without asking". Starting a to-do is a journal command the unbound-write gate
  lets through, so the agent could begin work on an environment it never chose. It is now told only that
  auto is on for that environment and applies once the session is on it; once it switches, its stops say
  the rest.
- A skill marked to load at every start kept being named after it was deleted or renamed, so every start
  and compaction told the agent to load a skill it could not find. Only installed skills are named.
- With auto mode on, a session was held over every open piece of work on its environment and told to end
  it, including work another session had opened. It is now held for its own work as before. Work a session
  that is still running opened is named once and left to that session; work a session that is gone opened
  is held at every stop, with `journal work end --force "<note>"` or asking the user as the way to close it.
- The counter that keeps a to-do number from being reused (1.136.8) was kept in `record.json`, so every
  `todos add` wrote the project-wide record, including from a subagent lent a single environment. It now
  lives in that environment's `todo` folder; a number kept by the older version is still honoured.

## 1.136.23 — To-dos close, start, move and wait the way they say they do

- Dropping a to-do made every to-do waiting on it ready, so auto mode could start work whose prerequisite
  was abandoned rather than finished. A dropped to-do is now marked struck, and what waits on it keeps
  waiting until it is reopened and finished. Reopening clears the mark.
- `journal todos done`, a drop and a `Journal: todos done N` commit trailer closed the row but left the work
  it had opened standing, holding every stop after it. They now end that work too and say so, as asking a
  question or setting a to-do aside already did.
- A `todos start` refused because work of that title was already open still marked the row started. A
  refused start now leaves the row as it was.
- A to-do a subagent reported finished was counted as "held by an agent still working", so auto mode seemed
  stuck on an agent that had finished. It is now listed as reported finished, yours to close with
  `journal todos done <n>`, in the stop notice and in `journal next`.
- Moving a to-do could give it the number of a row archived at its destination; it now takes the next
  number there, archived rows counted. Retitling a to-do to another open to-do's title is refused, as adding
  one is.

## 1.136.22 — What the channel delivers is not delivered again at the next stop

- A comment, an answered question or a decided suggestion pushed to an idle agent through the channel was
  delivered a second time by the next stop, because the channel kept its own list of what it had pushed and
  never marked the item told. The channel now marks what it pushes as told, in the same record the stop
  hook reads. A changed answer or decision is still pushed again.
- The stop hook marked comments, answers and decisions told before building the message that tells them,
  so a failure while building it lost them for good. They are now marked once the message exists.
- With auto mode on and nothing open, an answer on a to-do that was not next in line (for example one
  waiting on another to-do) was left to the auto notice, which only names the next one, and so was never
  told. It is now told like any other answer unless the auto notice will name it at this stop.

## 1.136.21 — A subagent cannot hide a journal write, close a row, or decide a suggestion

- A subagent's journal command written through a shell variable (`J=.journal/journal.py; $J pins add "x"`)
  or inside `bash -c` was not recognised as a journal write, so an agent lent nothing could file a pin under
  the name of the session that dispatched it. Variables are now resolved and `bash -c` / `sh -c` scripts
  read, and a journal line the hook cannot parse is refused for a subagent.
- A subagent lent an environment could close to-dos (`todos done`, `drop`, `reopen`, `work end --todo`)
  and decide suggestions. The skill always said a subagent reports a row finished and the dispatching
  session closes it, and suggestion decisions are the user's; both are now refused.
- The briefing pasted into a subagent's prompt showed example writes without `--as`, and each was refused
  on first use. The examples now carry `--as="<your name>"`.
- A heredoc body that only mentions a journal command (a patch script, a test) is no longer read as that
  command, so it is not refused as a suggestion decision.

## 1.136.20 — The write gate sees writes run through git options, xargs and find, and lets reads saved to temp files through

The gate that refuses writes while no work is open judged each command by its first word, so some
writes passed as reads and some reads were refused. An agent refused for `rm` could learn the ways
around it.

- Now writes: `git -C dir commit` and other git options before the subcommand; `git clean`, `merge`,
  `rebase`, `cherry-pick`, `revert`, `am`, `pull` and `switch`; `git stash` and `git worktree` unless they
  only list or show; `xargs rm` and anything else `xargs` runs that writes; `find` with `-delete`, or with
  `-exec`, `-execdir` or `-ok` running a write; `sed -i.bak` and `--in-place`; `perl -pi` and `-i`.
- Now reads: a read whose output is redirected into a temporary or scratch folder (`/tmp`,
  `/private/tmp`, `/var/folders`), such as `grep … > /tmp/out.txt` or `journal todos > /tmp/t.txt`.
- A session whose environment was claimed away can no longer carry a write past its refusal by starting
  the line with a journal decision.

`python3 -c` is still not judged: its script is quoted text, which the gate does not read.

## 1.136.19 — The context gate starts over after a compaction, and journal lines are judged fairly

- A context warning that was still waiting for a decision when the window compacted refused the first tool
  call of the new, nearly empty window, and the highest rung reached stayed recorded, so no warning came
  again for the rest of the session. A compaction now clears both, and the ladder starts from its first
  rung.
- `journal todos start 3 && git commit` and `journal --env=x work start "…" && git add .` now count as
  opening work before the write, as the skills teach. Before, they were refused and told to `work start`,
  which opened a second piece of work.
- `journal pins add "…" && git commit`, the decision the context refusal itself recommends, now passes that
  refusal, as `journal pin "…"` did.
- A line that merely starts with a journal decision (`journal nothing "x"; rm -rf build`) no longer carries
  the rest of the line past the environment, loop and wait checks. Only a line made entirely of journal
  commands skips those.

## 1.136.18 — A loop is asked for only when it has something to pick up, and is not assumed after a restart

- With auto mode on, the stop hook asked for a loop whenever work was open, even with nothing on the list
  ready, so an agent could start a loop that woke every 15 minutes to nothing. It now asks only when a
  to-do is ready, the same condition the write gate already used.
- Once the journal had seen a loop it remembered it for good, even in a session resumed the next day
  whose loop was long gone, and then nothing asked for one and auto mode stalled. The memory is now
  cleared when a session ends and when one starts or resumes; a compaction keeps it.
- `/loop` counts only when the user typed it. A tool result or file that merely mentions it no longer
  reads as a loop running.

## 1.136.17 — Narrating the next step no longer reads as putting work off

The check for work deferred in words matched an agent describing its next step: "Let me read the file,
then fix the bug", "I'll check the hook next", "For now, reading the file". The next tool call was
refused, or the stop held, and agents parked to-dos for work they were already doing.

- The pattern now needs a promise about later: "I'll … once / after / later / afterwards / as soon as",
  "come back to that", "circle back", "after this". "Let me", and "then", "next", "when" and "for now"
  on their own no longer count.
- Text that a tool call follows is not taken for the reply, so a stop that runs before the final
  message is written holds nothing for the line before the last tool call.
- At a stop, the hold asks for a to-do or one line saying nothing was put off. "Run this call again"
  stays only where there is a call: the refusal before a tool runs.

## 1.136.16 — A note that is only said no longer wakes the agent

Some things the stop hook tells the agent ask nothing of it: to-dos waiting while auto is off, a newer
journal, nothing on the list can be picked up, the cleanup and recall notes. They were sent as context
at the stop, and context at a stop re-opens the agent's turn exactly as a hold does, so one idle stop
could wake the agent three or four times with nothing to do.

They now go to the user as a message, which re-opens nothing, and the agent is handed them with the
user's next prompt. Holds, the things the agent does owe an action on, are unchanged.

## 1.136.15 — The channel wakes only the agent that holds an environment

With several sessions in one project, the channel could wake the wrong agent. A session on no
environment was sent every environment's messages, including an environment another agent was working.
Now:

- a session on an environment is woken for it, and of two sessions on one environment only the one seen
  most recently;
- an environment no session holds wakes one session on no environment, the one seen most recently, not
  all of them;
- a process id recorded by an earlier session is not trusted: the channel only acts for a session whose
  hook has run since shortly before the channel started.

Part of this change was already committed, unannounced, in 1.136.12 to 1.136.14, where the channel's
tests were failing. The tests now record when their session was last seen, and all 33 pass.

## 1.136.14 — Text before a tool call is never a turn's message

1.136.13 was not enough. The stop hook can read the transcript before Claude Code has written the
turn's final message at all, and with the fast cached read it usually did. The text written before the
last tool call was then judged as the reply, and a correctly tagged answer was reported as untagged.

A turn's message is now the last text that no tool call follows. While the final message is not yet
written, the turn has nothing to judge and nothing is held. A question put through the question tool
still counts as a message.

## 1.136.13 — The stop hook sees the turn's final message again

1.136.11's transcript cache read only up to the last newline, leaving a record still being written for
the next read. At a stop, that record is often the turn's final message. Without it, the text written
before the turn's last tool call looked like the final message, and a correctly tagged reply was
reported as "1 untagged message(s)". This happened on every turn that used a tool before answering.

A cached read now also reads a complete last record that has no newline yet, keeping its saved position
before it so it is read again once finished. The context reading does the same. The test for a
duplicate to-do title follows 1.136.12's new refusal.

## 1.136.12 — Amending a to-do no longer reads as adding one, and the skill says what goes where

An agent recording progress with `journal todos amend` showed in Activity as "Adding to to-do 380",
which reads as adding the to-do again. Activity now says "Adding a section to the brief of to-do 380",
and "Rewriting the brief of to-do" for a replace.

- `journal todos add` refuses a title that matches an open to-do even when the case, punctuation or
  spacing differs, and the refusal says where the words belong instead: the brief with
  `journal todos amend`, or progress with `journal work update`.
- The `journal-todos` skill now teaches it: a brief says what the to-do is and changes when the task
  does, and what was done or found while working it goes in `journal work update`.

## 1.136.11 — Stop and SessionStart stop re-reading the whole transcript

The stop hook parsed the session's entire transcript at the end of every reply, and the context
check scanned it again. Each hook runs as a new process, so neither could remember what it had
already read. A long session's transcript passes a hundred megabytes, and there the pause after
each reply was over a second.

Both now keep what they parsed on disk, in `.journal/runtime/<session>.lines.cache` and
`<session>.context.cache`, and read only what the transcript has gained since. Measured on a 122 MB
transcript: a Stop went from 1.15 s to 0.26 s, and a SessionStart from 0.79 s to 0.27 s. Hooks on a
short transcript cost what they did in 1.135.0. A line still being written is left for the next read,
a replaced transcript is read afresh, and the parsed-lines cache is removed when its session ends.

## 1.136.10 — The sidebar shows the agent compacting

While the agent compacts its context, the agent status at the bottom of the viewer's sidebar says
Compacting instead of Working. The PreCompact hook is wired again for this: it says nothing to the
agent, and records the event so the viewer can tell, until the session starts again on the far side
of the compaction.

Run `journal upgrade` so the new hook is added to `.claude/settings.json`.

## 1.136.9 — A clicked skill opens in the side panel with its quick actions

Clicking a skill in the agent page's Skills table opens it in the side panel instead of leaving the
page: where it comes from, when it loads, and its actions, Load it at every start and Ask the agent to
load it now, so setting several skills is a click each without navigating. Read the skill, or the
panel's title, opens its full page. Ctrl- or Cmd-click still opens the page directly.

## 1.136.8 — The agent page's Skills table scrolls

A project with many skills made the agent page's Skills table run on down the page. It now scrolls
inside its own height, with its header row staying in view.

## 1.136.7 — The package follows its own coding style where it was quick to

- `say()` in `reminders.py` and `work.py` now takes its message name positional-only, like every other
  module's.
- The viewer's top-level helpers are function declarations, and it builds strings with template
  literals throughout.
- The `outcome-names` rule is corrected: test files count their passing checks in a global `ok`, so
  a test unpacks an outcome as `took`, and only the package uses `ok`.

The older module docstrings and import placement are left as they are: the rules apply to modules
being written or reworked.

## 1.136.6 — The skills teach saying which to-do waits on which

The journal could always record that one to-do waits on another (`journal todos add --after=` and
`journal todos after <n> <m>`), and `journal next` and auto mode skip a to-do until what it waits on
has closed. No skill mentioned it, so agents filed dependent to-dos without saying so. The
`journal-todos` skill now has a section on it: set it while filing, set it when the work shows one,
read the other to-do's brief before designing against it, and use `block` for anything that is not a
to-do. The core skill points at it where a request is parked, and the skill loads when one to-do
depends on, builds on or has to wait for another.

Run `journal upgrade` to get the new skill text.

## 1.136.5 — Answers to your messages read like questions, not like something waiting on you

When the agent answers part of your message, Home shows it under Answers to your messages, in the same
list as Questions: the answer, the message it is about, and when. Opening one marks it read. It is no
longer an amber notification, and in Activity it is an ordinary line that opens the message, since an
answer asks nothing of you. Other notifications stay where they were.

## 1.136.4 — The work log starts folded

A piece of work's panel opens on what it is and where it stands. Its updates, now titled Work log with
their count, start folded and open from the label; once you open it, it stays open on the next visit.

## 1.136.3 — Tool use shows in Activity after a minute of quiet

The agent's commands, edits and reads are summed into one Activity line ("Ran 7 commands, edited 3
files"), written when ten have queued or at the agent's next journal event. A queue could sit unseen
for a long time when the agent stopped between those. Now, once a session has used no tool for a
minute, opening Activity writes its queued line, dated at the last tool use. Ten tool uses still write
the line at once.

## 1.136.2 — An accepted suggestion tells the agent which to-do to pick up

When you accept a suggestion, an idle agent is told through the channel that it was accepted, which
to-do it became, and the command to start it. Accepted with your change says the to-do carries the
change, and a declined one says not to suggest it again, with your reason.

## 1.136.1 — The channel runs the code it was upgraded to

The channel server runs as long as its session and loaded its code once, when the session started.
An upgrade in between never reached it, so a session started before 1.135.1 was never told about an
accepted or declined suggestion. The server now checks the package's files on every poll and, when one
changed, reloads its poll code from disk, keeping its start time so nothing older is pushed.

A channel server already running is still the old code: reconnect it once (`/mcp`) or start a new
session, and it follows upgrades from then on.

## 1.136.0 — A coding style of the project's own, and to-dos that archive themselves

A minor release that gathers everything since 1.135.0:

- **Coding style.** A project keeps its coding style as rules, one per subject, and each rule is
  generated into its own `style-<subject>` skill, listed in `CLAUDE.md` and `AGENTS.md`
  (`journal style add|show|set|remove|sync`). The viewer has a Coding style page: the rules, the
  open questions about the style with their code side by side, and **Ask for a coding style review**,
  which has the agent send a subagent to read the code and settle or ask about each difference.
  Questions can be about the style (`--about="style"` or `--about="style <subject>"`). A generated
  skill's description reads "Use when …. This project's rule: …", and its examples link works.
- **Done to-dos archive themselves** 7 days after they close, into `todo/archived/`, set per
  environment in Settings or with `journal todos keep <days>`. A new to-do never reuses an archived
  or deleted to-do's number.
- **Suggestions and safety.** A decided suggestion reaches an idle agent through the channel. Links in
  the viewer's markdown can no longer run script. A failing viewer request answers with its error.
  The to-do list and environment requests are much faster.
- **This project's own rules.** The package now keeps six coding style rules of its own: no module
  docstrings, imports at the top, function declarations and template literals in the viewer, the
  positional-only `say()` helper, and `ok` for unpacked outcomes.

Nothing to do beyond `journal upgrade`.

## 1.135.8 — Done to-dos archive themselves

A done to-do now leaves the list on its own, 7 days after it was closed. It moves into the
environment's `todo/archived/` folder and is not deleted. Reads skip that folder, so the list stays
short, and nothing has to change in a project: done to-dos already in the folder are moved at the next
sweep.

- `journal todos keep <days>` sets how many days, per environment, and 0 keeps done to-dos listed.
  Settings has the same field, under To-dos.
- A new to-do never takes the number of an archived or deleted one. Before this, removing the
  highest-numbered to-do meant the next one reused its number.
- `journal todos prune` still archives or deletes by hand, and a done to-do past 30 days is still
  deleted, as before.

## 1.135.7 — The Coding style page, and questions about the coding style

The second part of the Coding style tool. The viewer has a Coding style page, opened from its new
icon in the top bar.

- The page lists the rules. A rule's panel shows its decision, when it loads, its skill and its
  reasoning, with Edit and Remove.
- **Ask for a coding style review** sends the agent a message, with where to look if you say. The agent
  sends a subagent to read the code, asks you about each difference with the code side by side, and
  turns your answers into rules.
- Open questions about the coding style sit at the top of the page, answerable right there.
- A question can be about the coding style: `--about="style"`, or `--about="style <subject>"` for one
  rule, which must exist. Its chip links to the page.
- The `journal-questions` skill says how an agent runs the review.
- The help button's title reads "Help for <page>".

## 1.135.6 — Coding style rules, each generated into a skill

The first part of the Coding style tool. A project keeps its coding style as rules, one per subject,
at `.journal/style/<subject>/item.md`. Each rule holds its title, the decision, when it applies, the
reasoning, bad and good examples, and the phrases that should load it.

- `journal style add <subject> "<title>" --decision="…" --when="…" --brief` records a rule (its body on
  stdin). `journal style`, `style show`, `style set` and `style remove` list, read, change and retire
  them.
- Every change regenerates the skills. Each rule becomes a `style-<subject>` skill in `.claude/skills/`,
  with its `SKILL.md`, worked examples and trigger phrases, so an agent loads it while writing code that
  subject covers. A retired rule's skill is removed, but a hand-written `style-…` skill never is.
- `CLAUDE.md` and `AGENTS.md` get a Coding style block listing the skills, and it goes away when no rule
  is left. `journal style sync` regenerates everything, and install and upgrade run it too.

Next come the viewer page and the questionnaire an agent asks to find the rules.

## 1.135.5 — The to-do list reads its folder once

Loading the to-do list re-read the whole to-do folder once for every row, to check what each row was
waiting on. With a few hundred to-dos that took about a quarter of a second, every five seconds, on
Home and on the To-dos page. The list is now read once per request and handed to every row. The rows
are unchanged, and the terminal's `journal todos` does the same.

## 1.135.4 — Environment requests no longer count everything first

Every request the viewer made for an environment first checked that the environment existed by
counting the to-dos, pins, work, docs, messages and more of every environment: about 12 ms each time,
several times per poll. It now checks the name against the list of environments directly, the same
list those counts were built from, which takes a fraction of a millisecond. Answers are unchanged.

## 1.135.3 — A failing request answers with its error

When a request the viewer makes hit an error inside the journal, the server closed the connection
without an answer. The page showed a failed fetch, and after a write you could not tell whether it
went through. It now answers 500 with the error, as its other routes already did, so the page shows
what went wrong and the write reads as not done.

## 1.135.2 — No script links in the viewer's markdown

The viewer turned any markdown link into a clickable link, `javascript:` ones included. Such a link in
a message, a to-do's brief, a doc or a pin could run script in the viewer's page, which may write to
the journal. Now only web links (http and https), mail links, anchors and relative paths become links.
A link with any other scheme shows as its text.

## 1.135.1 — Deciding a suggestion wakes the agent

The channel woke an idle agent for your messages, answered questions and comments, but not when you
accepted, adjusted or declined a suggestion. It does now. Each decision is pushed once, naming the
suggestion, and a changed decision is pushed again. As with answers and comments, it happens only
with auto mode on; with auto mode off, only a message wakes the agent.

## 1.135.0 — Skills that load when they should, rules that always hold, and a clearer viewer

A minor release that gathers everything since 1.134.0:

- **The journal skills.** The one long skill is now a core `journal` skill plus six focused ones:
  `journal-todos`, `journal-questions`, `journal-messages`, `journal-memory`, `journal-docs` and
  `journal-agents`. Each loads when its part comes up, and each description is tuned to trigger. The
  skills cover what shipped recently: comments on work, notifying about a message, `journal claude`.
- **The model rule.** The rules the journal ships, with B1 (name the model on every dispatch), are
  always written into `CLAUDE.md` and `AGENTS.md` and shown at every start; `builtin_rules` no longer
  turns them off. The hook refuses a subagent dispatch that names no model, except a fork or an agent
  whose definition sets one.
- **Subagents and skills in the viewer.** A session's subagents are a table with their model. Home
  shows the subagents at work. The agent page lists the skills, and which the session loaded. A skill's
  page can ask the agent to load it now, or at every start. Helpers that only stop no longer show as
  nameless subagents.
- **Smaller changes.** Side panel sections fold. A commit's work and to-dos come before its files. An
  asked question stops being amber once you open it. A journal read with a shell redirection
  (`2>&1`) is no longer taken for a write.

Nothing to do beyond `journal upgrade`.

## 1.134.16 — An asked question stops asking once you open it

An "Asked question" line in Activity stayed amber until you answered the question. It now stops
being amber as soon as you open the question, in its panel on Home or on the Questions page, since
opening it means you have seen it. An answer, or a withdrawal, clears it as before. Opening a
question writes no Activity line of its own.

## 1.134.15 — Ask the agent to load a skill, now or at every start

A skill's page has two buttons. "Ask the agent to load it now" leaves the agent a message to load that
skill, and it gets it at its next stop, or at once if it is idle. "Load it at every start" puts the
skill in the block every session is given when it starts, with the words LOAD THESE SKILLS NOW. The
same button takes it off again. The page says whether a skill loads at every start, and the agent
page's Skills table marks those with "every start". A skill page now opens under its environment,
`#/env/<name>/skills/<skill>`.

## 1.134.14 — No more nameless subagents with nothing to open

The agents lists and pages showed subagents with no name, no model and no transcript. They were the
harness's own helpers, such as the away summary and a background task, which stop with an agent id but
call no tool and keep no transcript. The hook recorded each stop as a subagent that had finished. A stop
now counts only for an agent already seen making a tool call, or one that left a transcript, so every
subagent listed is one that was dispatched and has a page worth opening. A subagent without a
transcript says so plainly. The helpers already recorded drop off the list 30 minutes after they were
seen.

## 1.134.13 — Home shows the subagents at work

While any subagent is working, Home shows a small "Subagents at work" section under Open work. Each
one gets a single line with a live dot, its name, the model it runs on and when it last wrote, and
opens its agent page. When no subagent is working, the section is not there.

## 1.134.12 — A journal read with a shell redirection is no longer taken for a write

A research subagent ran `journal todos --all 2>&1 | head` and was refused, as if it had written to the
journal. The hook passed the shell's `2>&1` along as an argument, and `journal todos <word>` is the
shorthand for adding a to-do. The same misreading could refuse a main session's read while no work
was open. Redirections (`2>&1`, `2>/dev/null`, `> file`) are no longer counted as arguments, and a
separator stuck to a word (`head -150;`) ends the command. A real write is still recognised, with a
redirection or without.

## 1.134.11 — A subagent dispatch that names no model is refused

As you asked in message 259, the hook now refuses an Agent call that does not name its model. The
refusal names the three choices: haiku for mechanical work with a known answer, sonnet for care
without invention, opus only where the task turns on judgement. Unset would hand out the session's
own model, the most expensive in the room. Two dispatches go through without one: a fork, which
cannot take a model, and a custom agent whose own definition sets its `model:`. The core skill's hook
table and `journal-agents` say so.

## 1.134.10 — A commit's work and to-dos come before its files

On a commit's page, the work it was made during and the to-dos it belongs to now come right after its
message, and the list of changed files comes last. A commit that changed many files no longer pushes
them to the bottom of the page.

## 1.134.9 — The journal's own rules are always written and shown

As you answered on question 22, the rules the journal ships, with the model rule (B1) among them, can no
longer be switched off. Every install and upgrade writes them into `CLAUDE.md` and `AGENTS.md`, and every
session is shown them at its start. The rules list always includes them too. The `builtin_rules` setting
is gone. A project that still has it in `settings.json` is told "unknown setting 'builtin_rules' — it
does nothing", and gets the rules back on its next upgrade.

## 1.134.8 — The agent page lists the skills

An agent's page has a read-only Skills section. It lists every skill on disk, this project's and your
own, with where each comes from and how often that session loaded it. The count comes from the Skill
tool calls in its transcript. A skill it loaded that has no file here, such as `loop`, is listed as
built in. A skill with a file opens on its own read-only page. Skills are changed in their SKILL.md
files, not through the journal.

## 1.134.7 — A test holds the model rule in every CLAUDE.md

Nothing changes for projects. Every install and upgrade already writes the journal's rules, with the
model rule (B1) among them, into a managed block in `CLAUDE.md` and `AGENTS.md`. A test now makes sure
of it: a fresh install writes the rule into both files, and an update restores a hand-edited block
without touching anything outside it. The only way to leave the block out is `builtin_rules` set to
false in the project's settings.

## 1.134.6 — The journal skills load when they should

Reviewed against skill-creator's guidance. The core `journal` skill's description was 1037
characters, over the 1024-character limit. It is now 895 and still names the six focused skills. Each
focused skill's description now includes the words that should load it: "later" and "park it" for
`journal-todos`, "which do you prefer" for `journal-questions`, "remember this" and "from now on" for
`journal-memory`, "research" and "write a report" for `journal-docs`, "use a subagent" for
`journal-agents`, and a channel notice or comment for `journal-messages`. All seven pass
skill-creator's checks: front matter, name, no angle brackets, description length, a body under 500
lines. A test now checks that the core skill names the model rule by itself.

## 1.134.5 — The core skill names the model rule again; skill-creator in this project

The split in 1.134.4 moved the model rule into `journal-agents`, which left the core `journal` skill
without it. A dispatch does not wait for that skill to load, so the core skill says it again: name
the model on every subagent (`haiku`, `sonnet`, `opus`). The rule itself was never gone. It ships as
rule B1 and every project sees it at every start.

This project also has the `skill-creator` skill now, in `.claude/skills/skill-creator/`, copied from
the workflows project. It is for working on this package's skills and is not shipped to other
projects.

## 1.134.4 — The journal skill is split into a core skill and six focused ones

The one long journal skill (842 lines) is now a core `journal` skill of about 290 lines. It covers the
first decision on every request, tags, declaring work, choosing the environment, looking before you
answer, starts and compactions, and hook holds. Beside it are six focused skills, each loading when
its part comes up:

- `journal-todos` — to-dos, blocking, auto mode and the loop, commit trailers.
- `journal-questions` — asking the user, answers, suggestions.
- `journal-messages` — messages and their replies, comments, notifications, the viewer and its channel.
- `journal-memory` — pins, rules, reminders, the context-warning decision, cleanup.
- `journal-docs` — reports, docs and tools.
- `journal-agents` — dispatching subagents, grants, what a subagent may not do.

The text moved as it was; nothing was dropped. The core skill lists the focused ones with when to load
each. The start block, the refused question tool, the context warning and the upgrade notice name the
skill the moment needs. `journal upgrade` installs all seven into `.claude/skills/`.

## 1.134.3 — The journal skill catches up

The skill now says what shipped without it. A comment can be on a suggestion, a message or a piece of
work too, and a comment on a piece of work is a question or a steer while it runs. `journal notify
--about` can point at a message. `journal claude` starts Claude with the journal's channel, and a
session started that way is woken while idle: by a message, and with auto mode on, by answers and
comments as well. Nothing else changes; `journal upgrade` brings the new skill.

## 1.134.2 — A session's subagents as a table, with their model

On a session's page, "Subagents it sent" is now a table like "Most recent work", with a column each
for the subagent, its status, the model it ran on and when it last wrote. Each row still opens that
subagent's page.

## 1.134.1 — Side panel sections fold

Every section in a side panel folds from its label: Brief, Work log, Files changed, Commits, Replies,
Comments and the rest. A click on the label, or Enter on it, hides the section and a chevron shows its
state. Your browser remembers which sections are folded, by name, so a long Files changed list can
stay out of the way of Comments. A message's Files section keeps its Attach files button while folded,
and a question's answer choices never fold.

## 1.134.0 — An About page, and a quieter message box

A minor release that gathers everything since 1.133.0:

- **About.** The sidebar footer shows the journal's version, just above the agent's status. It opens
  an About page with the version and the whole changelog, newest first.
- **The Activity message box.** The Send button sits inside the box, bottom right, and shows only
  while there is something to send. The Enter hint under the box is gone, and a send error shows on its
  own line.
- **Replies.** The agent's replies under a message are boxed with a thin border and a lighter
  background, so they are easy to find.
- **Subagents.** A listed subagent names the model it ran on, in a session's "Subagents it sent" list
  and in the agents dropdown.

Nothing to do beyond `journal upgrade`.

## 1.133.5 — The Activity send button sits inside the message box

The Send button under the Activity message box is gone. A small arrow button now sits inside the box,
bottom right, and shows only while there is something to send. Enter still sends. If a message cannot
be sent, the error shows on its own line under the box.

## 1.133.4 — An About page with the version and the changelog

The sidebar footer shows the journal's version, for example "Agent journal 1.133.4", just above the
agent's status. It opens an About page with that version and the whole changelog, newest first. The
viewer reads both from `/api/about`.

## 1.133.3 — A listed subagent names its model

A subagent's own page already showed the model it ran on. Where subagents are listed, the model is
now named too: in the "Subagents it sent" list on a session's page, and in the agents dropdown in the
Activity header, for example "Finished · claude-sonnet-5".

## 1.133.2 — No Enter hint under the Activity message box

The line "Enter sends, Shift+Enter adds a line" under the message box in the Activity column is gone.
The box still sends on Enter and adds a line on Shift+Enter, and the same spot still shows an error if
a message cannot be sent.

## 1.133.1 — The agent's replies stand out

Under a message, a reply from the agent is now boxed: a thin border and a slightly lighter background,
so it is easy to spot among the message's details. Your own replies stay plain.

## 1.133.0 — Several journals told apart, and answers you can act on

A minor release that gathers everything since 1.132.0:

- **Several journals at once.** With more than one journal viewer running, each wears a thin strip at
  the top in its own colour from a pool of ten, never shared, with a readable label. The project name
  on the strip opens a switcher to the others. Both journal pickers list the journal you are in first,
  highlighted.
- **Answers.** An "Answered your question" notification is amber on Home and in Activity until you
  read it. Open shows the answer in Home's side panel and marks it read. An answer can end with a
  follow-up question you click (`messages reply … --follow-up="…" --option=…`).
- **Auto mode.** With auto mode off, only a message you leave wakes the agent. Answered questions and
  comments wait for its next stop, and nothing sends it to the to-do list.
- **Smaller things.**
  - Activity says which setting you changed.
  - A message the agent has read says "Being handled", short, with the time on hover.
  - A status icon stays beside its text when the text wraps.
  - Activity stays newest first.

Nothing to do beyond `journal upgrade`.

## 1.132.15 — The journal pickers put this journal first

In both journal pickers, the one in the sidebar and the one on the strip's tab, the journal you are in
is listed first with the selected background. Its row answers the pointer without looking like a link,
and every other journal's row highlights on hover. Colours are unchanged.

## 1.132.14 — Activity is newest first again

1.132.13 moved the newest Activity line to the bottom; you preferred it at the top after all. The
newest line is first again. When a line arrives, the list returns to the top unless the pointer is over
it, and new lines slide in from above, as in 1.131.90.

## 1.132.13 — Activity reads top to bottom, newest last

As you chose on question 19, the Activity column now lists the newest line at the bottom, right above
the message box. It opens at the newest line and follows new ones as they arrive, but only while you
are at the bottom: scroll up to read something older and it stays where you are. New lines slide up in
from below. This replaces the jump to the top from 1.131.90.

## 1.132.12 — An answer can end with a question you can click

When the agent answers a question in your message and the answer leaves a decision open, it can ask a
follow-up in the same step. The command is `journal messages reply <n> "<answer>" --part="<the
question>" --follow-up="<question>" --option="…" --option="…"`. The follow-up is a question about
the message, with options you click, and you get a notification for it. A follow-up that lists its
choices in its own text is refused like any other question, and the reply is not written either. The
skill tells the agent to ask one whenever an answer leaves something to decide.

## 1.132.11 — Each running journal gets its own colour, with a readable label

The strip's colour came from the project's name, so two journals could land on similar colours. It
now comes from a pool of ten colours, and journals running at the same time never share one. Every
viewer hands out the same colours from the same list of running journals, so the strip and the
switcher's dots agree across tabs. Each colour carries the label colour that reads best on it, white
on the violets and near-black on the rest. Another project's viewer shows its strip once that project
upgrades.

## 1.132.10 — The strip's project tab has room around its name

The project name on the strip's tab ran into the tab's bottom edge and rendered larger than meant. A
`font` shorthand holding `inherit` is invalid CSS, so the button fell back to its own font size. The
tab now has an explicit 10px font and padding, and the name sits centred below the strip.

## 1.132.9 — A notification opens in Home's side panel, and is read when opened

On Home, Open on a notification used to leave the page for the message's own page. It now shows the
message, to-do, question, suggestion or piece of work in Home's side panel. Open in the bell's dropdown
does the same while you are on Home; a notification about a report or document still opens its page.
Opening a notification marks it read. Amber is kept for Home's notification rows: the bell's dropdown
is plain again, as it was before 1.132.7.

## 1.132.8 — The strip's project tab switches journals

With several journals running, the project name on the colored strip at the top is a button. It opens
a list of the journals running on this machine, each with its colour, port and version. This one is
marked, and a click on another opens its viewer. Escape or a click elsewhere closes the list. With
one journal running there is still no strip.

## 1.132.7 — An answer to your question stands out

An "Answered your question" line was easy to miss. Until you read its notification, it now shows
amber in Activity with an Open button, like a question waiting on you. Its notification is amber on
Home and in the bell's dropdown too. The Open button on a Home notification sat in the middle of the
row; it now sits with Mark read on the right.

## 1.132.6 — An "Answered your question" notification opens the answer

The notification only said an answer was there; it could be marked read but not opened. It now has an
Open button, in the bell's dropdown and on Home, that goes to the message: your question quoted, with
the agent's answer under it. A notification can point at a message now
(`journal notify "…" --about="message 5"`). The two answer notifications sent before this fix were
given their message back.

## 1.132.5 — "Being handled" stays short

A message the agent has read showed "Being handled · the agent read it 1 minute ago" in its Status
row, which wrapped in the side panel. It now says "Being handled"; hover the row to see when the
agent read it.

## 1.132.4 — With auto mode off, only a message wakes the agent

Before, the channel woke an idle session for an answered question or a comment even with auto mode
off, and the agent could take that as a cue to start on the to-do list. With auto mode off, only a
message you leave wakes it now. Answers and comments wait for the agent's next stop, and nothing
sends it to the list. With auto mode on, it is woken for all of them once it is idle, as before.

## 1.132.3 — Activity says which setting you changed

Changing a setting in the viewer showed only "Changed the settings" in Activity. The line now says
what changed: "Turned auto mode on", "Activity shows the last 80 line(s)", "Reports stay listed
for 7 day(s)". Several settings changed at once are listed together.

## 1.132.2 — A status icon stays beside its text

In a panel's Status row, a long status such as "Being handled · the agent read it 1 minute ago" wrapped
under its icon, leaving the icon alone on the line above. The icon now stays beside the first line,
and the wrapped text lines up under the text.

## 1.132.1 — Each journal wears its project's colour when several are open

With more than one journal viewer running on the machine, it was easy to lose track of which tab
was which project. Each viewer now shows a thin strip along the very top in a colour of its own,
taken from its project's name, with the name on a small tab. The journal switcher shows the same
colour beside each project. With one journal running, nothing changes.

## 1.132.0 — The viewer grows up: agent pages, answered questions, comments on work, and a calmer Activity

A minor release that gathers everything since 1.131.79. What changed, in short:

- **Agents.** Each session and subagent has its own page, with its most recent work as a table and
  its raw transcript, newest lines first and without empty lines. The agents list in the Activity
  header splits active from idle, and the journal listens for SubagentStop to know when a subagent
  is finished. `journal upgrade` adds that event to `.claude/settings.json`.
- **Messages.** A message shows "Being handled" as soon as the agent reads it. The agent answers a
  question in a message with `journal messages reply <n> "<answer>" --part="<the question>"`: you get
  a notification and see the answer under the quoted question. Adding files to a sent message works
  again for files over 64 KB.
- **Questions.** `journal questions add` refuses a question that lists its choices in its own text,
  and says to give each choice as an `--option`. "Agent's pick" shows only while you choose.
- **Work.** Every file a piece of work changes is recorded on it, including files a script writes
  and edits made in the same line as a commit. A work item takes comments, like a to-do does.
- **Commits.** Commit hashes are easy to spot and click, a commit has its own page, and the subject
  beside a hash is quieter.
- **Suggestions and reports.** The Suggestions page can ask the agent for suggestions, with an
  optional focus. The skill tells reports (temporary) from documents (lasting), and reminds the
  agent how to write a report when a to-do or message asks for one.
- **Files.** Files lives under Documents, with an image library, and lists the files the agent kept.
  Image previews keep their shape.
- **The viewer.** A side panel's title is the link to its page. New buttons carry a plus, sort
  controls show on hover, and counts that are zero are left out. Activity lines slide in, and the
  list returns to the newest line when one arrives. Coming back to the tab no longer piles up the
  animations, and a notice says what the agent did while you were away.
- **The channel** no longer misses a message sent in the same second it started.

Nothing to do beyond `journal upgrade`. If a viewer is running from before 1.131.63, restart it
once with `journal serve`; after that it restarts itself when the journal's code changes.

## 1.131.99 — The agent answers the questions in a message

When a message asks the agent something ("are we doing this already?"), the agent answers that part
instead of filing it away. It replies with `journal messages reply <n> "<the answer>" --part="<the
question's words>"`. That records the part as answered, puts the answer under the quoted question in
the message's Replies, sends you a notification, and shows "Answered your question" in Activity. The
rest of the message is handled as before. The skill, and the commands listed under a shown message,
tell the agent to do this.

## 1.131.98 — Coming back to the tab: no pile-up, and what happened meanwhile

After a while on another tab, every change arrived at once when you came back. Rows lingered and
slid out together, and they piled up at the bottom of a list. On that first refresh back, new rows
still fade in, but rows that left go at once and nothing slides. A notice at the bottom then says
what the agent did while you were away, for example "4 to-dos closed · 1 to-do added · 2 messages
filed". It only shows after more than a minute away, and it goes after 15 seconds or when dismissed.

## 1.131.97 — Reports and documents, told apart

An agent asked to have subagents write a report sometimes wrote a document instead. The skill now
says plainly which is which. A report is temporary: what you checked or found, as it stands now. A
document is lasting documentation of the codebase or the environment. When the answer is neither, it
goes in the reply or in a pin. When a to-do the agent starts, or a message it reads, mentions a
report, the command also reminds it how to write one with `journal reports add`.

## 1.131.96 — Comment on a piece of work

A work item takes comments like a to-do or a message does: from the Comments section of its panel in
the viewer, or with `journal comments add "work 7" "<the comment>"`. The agent is told at its next
stop, and the channel wakes an idle session for it. Use it to ask about a piece of work or steer it
while it is under way.

## 1.131.95 — The agents list splits active from idle

The agents button in the Activity header lists agents under Active and Idle, and its count is the
active ones. A session is active while it works and idle once it stops. An idle session drops off
the list after 30 minutes. A subagent is active while it makes tool calls, idle after two quiet
minutes, and finished the moment it stops.

The journal now listens for Claude Code's SubagentStop event to know when a subagent stops.
`journal upgrade` adds it to `.claude/settings.json`, as it does for the other events.

## 1.131.94 — Ask the agent for suggestions from the Suggestions page

The Suggestions page has an "Ask for suggestions" button. It opens a panel where you can say what to
look at, or leave it empty. Sending it leaves the agent a message: send a background subagent to
research this environment, file what it finds with `journal suggest`, and carry on with its own work
meanwhile. The suggestions show up on the page as they are filed.

## 1.131.93 — Every file a piece of work changes is recorded on it

Files changed by an edit showed on the work item as they changed, but two kinds of change were never
recorded. One was a script that writes files, such as `python3 - <<'PY' … PY`. The other was a shell
line that edits files and commits in the same go. Both now count toward the work item's files, and
the Work panel on Home keeps showing them as they come in.

## 1.131.92 — Files lives under Documents, with an image library

A message's file that the agent kept was missing from Files; only files moved into a document are
left out now, since they show with that document. Files shows images as a grid of thumbnails, each
with its name and the message or document it came from, and every other file below as a list. Files
is no longer a sidebar entry: open it from the Files button on an environment's Documents page.

## 1.131.91 — A message shows the agent is handling it

When the agent reads a waiting message (`journal messages show` or `messages waiting`), the message
is marked as being handled. The viewer shows it with the in-progress icon and "Being handled · the
agent read it …" until it is processed. Opening it in the viewer does not count as the agent reading it.

The channel also missed a message sent in the same second it started: times are stored in whole
seconds, and it compared them with its exact start time.

## 1.131.90 — New buttons with a plus; quieter sort controls; a livelier Activity

The New buttons in each list's bar are flush, with a plus before the label. A list's sort controls
show only while you hover its group header, and with one way to sort just the arrow shows. New
Activity lines slide in and old ones fade out, and when a line arrives the list goes back to the
newest one, unless the pointer is over it.

## 1.131.89 — The agent page lists its work as a table

An agent's page showed its last ten pieces of work as plain rows. It now shows "Most recent work" as
a table, newest first: the work, whether it is open, files, commits and when. Load more shows ten more.

## 1.131.88 — A side panel's title opens its page

The side panel's "Open page" button is gone. Its title ("To-do #239") is the link now: hovering it
highlights it and shows an arrow.

## 1.131.87 — A question that lists its choices in its text is refused

An agent sometimes wrote a question as "Which way? A) keep it B) drop it", which the user can only
read, not click. `journal questions add` and `questions edit` now refuse a question whose text lists
choices ("A) … B) …", "1. … 2. …" or bullet lines) and say how to ask it: the question in one line,
the context in `--description`, and each choice as its own `--option`. The skill says the same.

## 1.131.86 — Image previews keep their shape; Agent's pick only while choosing

A tall image attached to a message or document was stretched to the panel's width. Previews now keep
their proportions. On an answered question, "Agent's pick" shows only while you change the answer.

## 1.131.85 — Quieter counts and commit subjects

Activity says "used 3 tools" rather than "used 3 other tools". The agents count in the Activity
header is a grey outlined badge, so it no longer looks like something unseen. Home's Open to-dos card
lists only the counts that are not zero. The commit subject after a hash is smaller and fainter, so
the hash is the thing to click.

## 1.131.84 — Files can be added to a sent message again

Adding files to a message that was already sent failed with "the body is larger than 64000 bytes"
for anything but a tiny file. That path now takes as much as sending a message with files does.

## 1.131.83 — The transcript leaves out empty lines

An agent's transcript showed many lines with nothing on them: just "Agent" or "Tool result", a time
and a line number. They are records the agent's session writes with no text and no tool in them.
The transcript page now leaves them out. Every other line keeps its number, and the line count at
the top counts only the lines shown.

## 1.131.82 — A transcript opens at its newest lines

An agent's transcript page started at the first line, so reaching what the agent did last meant
scrolling through the whole session. It now opens at the newest lines, scrolled to the bottom.
Scrolling up loads the thousand lines before them, and keeps your place while they arrive.

## 1.131.81 — The commit page shows the whole commit

A commit's page showed only its subject, its hash and the work and to-dos it belonged to. It now
also shows who made it and when, the rest of its message, every file it changed with lines added and
removed, a **View on GitHub** link, and the pull request that holds it when there is one. The pull
request is looked up with the GitHub CLI, once per commit; without it the page says the pull request
is not known.

## 1.131.80 — Commit hashes are easier to see and click

The short commit hash in a to-do's work log, a piece of work's commit list and the commit page was
faint and gave no sign it could be clicked. In the work log it also stretched into a wide box on its
own line, with the commit's subject wrapping underneath. The hash is now a small button on the same
line as the subject, in the accent colour, and it lights up when you hover it.

## 1.131.79 — The channel no longer floods a new session with old answers

Since 1.131.53 a session started with the channel, and on no environment yet, was pushed everything
waiting on every environment. A fresh session could receive a burst of "The user answered question
N" lines from other environments, some of them answered long ago and never marked as told. Now the
channel only pushes what arrived after it started, and a session that has no environment yet is
woken for new messages only. Answers and comments reach the session on their own environment.

## 1.131.78 — A page for each agent, and its transcript

Each agent in the list in the Activity header now opens its own page. A session's page shows
whether it is working or idle, its model and how full its context is, the work it declared with the
files and commits on each, and the subagents it sent. A subagent's page shows what it was sent to
do, whether it is still working, and the session that sent it. **Open transcript** on that page
shows the agent's raw transcript from the start, a thousand lines at a time: scrolling down loads
the next thousand. The transcript endpoint from 1.131.74 is gone.

## 1.131.77 — No Add note on work, and no Transcript page

A piece of work had an **Add note** button in the viewer, but the agent was never told about a note
added there. Worse, such a note counted as the agent making progress, and it cancelled whatever the
agent had marked itself as waiting on. The button is gone. Notes on work are the agent's own record,
written with `journal work update`. To tell the agent something about a piece of work, leave a
comment on it: comments reach the agent at its next stop.

The Transcript page from 1.131.74 is gone too, with its sidebar item and the Activity links to it.
An agent's conversation will be part of a page per agent, reached from the agents list in the
Activity header.

## 1.131.76 — The side panel on Home has an Open page button

When you click a to-do, message, question, suggestion or piece of work on Home, it opens in the
panel on the right. Its title linked to the item's own page, but nothing showed that it could be
clicked. The panel's header now has an **Open page** button with an arrow, next to the close
button.

## 1.131.75 — Home's cards show what waits on you

The four cards at the top of Home were Message queue, Questions for you, In progress and Blocked.
Messages rarely wait, because the agent picks them up quickly, and in progress and blocked were two
cards for one list. Now the cards are **Notifications** (unread, for you), **Questions for you**,
**Suggestions** waiting on your decision, and **Open to-dos**, which counts every open to-do and
shows underneath how many are in progress, waiting on you, and blocked.

## 1.131.74 — A Transcript page for reading the agent's session

There is a new Transcript page in the sidebar. It shows the session working on the environment:
your messages, the agent's replies and the tools each step used. **Compact** shows the
conversation; **Full** adds every tool's output and what the journal told the agent. The newest
part loads first, and **Load earlier** goes back a page at a time, so a long session never loads
all at once. Clicking one of the agent's own lines in Activity, like "Ran 3 commands", opens the
transcript at that moment with those steps highlighted.

## 1.131.73 — Documents show open or archived, not both

The Documents pages, for the project and for an environment, listed archived documents in among
the open ones. An archived project document then sat with the project documents, which read as if
archiving had moved it there. It had not: archiving never changes which environment a document
belongs to. Both pages now have an Open / Archived switch beside New doc, and show one or the
other.

## 1.131.72 — Row highlights on Home keep a straight edge in the middle of a list

When a row on Home was highlighted, because it was new or had just moved, the highlight had
rounded corners on every row, so rows in the middle of a list looked like separate pills. Now a
highlight is square, and rounds only on the corners where its row meets the list's rounded top or
bottom edge.

## 1.131.71 — A message you send shows in Activity right away

After sending a message from the Messages page or from the box under Activity, the "Wrote message"
line appeared only when Activity next refreshed, up to five seconds later. Activity now reloads as
soon as the message is stored, and after any other change you make in the viewer.

## 1.131.70 — Help pages say how the agent uses each resource

Each page's information button explained what a resource is and what you can do with it, but not
how the agent works with it. Every help page now ends with a short "How the agent uses it" part:
when the journal hands the resource to the agent (at the start of a session, after a summary, at
a stop), which commands it reads and writes it with, and what reminds it. The Rules page, for
example, explains that rules come with every session and that a regular cleanup has the agent
reread them.

## 1.131.69 — `journal claude` passes your other flags to Claude

`journal claude` refused any flag it did not know, so `journal claude --continue
--dangerously-skip-permissions` failed. Now every flag it does not use itself goes straight to
`claude`, in the order you typed it, before the prompt. `--dry-run` is still the journal's own.
Give a flag's value with `=`, as in `--model=sonnet`; a value after a space is read as part of the
prompt.

## 1.131.68 — A subagent shows on the environment it works on

The agents list in the Activity header showed no subagents. A subagent's own id is bound to no
environment, so its heartbeat was filed under the project's start environment instead of the
environment of the session that sent it. It is now filed there, so a running subagent appears in
that environment's list, named by its description.

## 1.131.67 — New and Archive sit in the bar above each list

The buttons that belong to a list, New (New to-do, New pin, Start work and so on) and Archive,
moved out of the top bar into the bar right above the list, beside its count ("3 open"). The top
bar keeps the page's name and the tools that work on every page. Documents and Tools have their
New button there too.

The hide button in the Activity column's header is gone. The Activity button in the top bar
still shows and hides the column.

## 1.131.66 — See which agents are working, and when one hands work to a subagent

When the agent dispatches a subagent, Activity now shows "Dispatched a subagent" with the
description the agent gave it. A new button in the Activity column's header lists who is working on the
environment: each session, marked working or idle, and each subagent that has been active in the
last 30 minutes, named by its description and the session that sent it. The badge counts the
ones working now.

A session continued with `claude --continue` or `--resume` also counts as running again. It
used to stay marked as ended from its earlier exit, so it was missing from this list and the
sidebar's agent dot never showed it working.

## 1.131.65 — See what each commit covered

When the agent commits while a piece of work is open, the journal now keeps the commit's hash
and subject on that work. A to-do's work log shows a "Committed" line with the short hash, and
a work item lists its commits. Click a hash to open the commit's page: it shows the work the
commit was made during and the to-dos that work belongs to. Commits made before this version
were not recorded, so they have no page.

## 1.131.64 — An agent is told to restart a viewer that cannot restart itself

A viewer started before 1.131.63 does not pick up new code by itself. Until now nothing told the
agent, so after an upgrade someone had to notice and ask for a restart. Now, when this project's
viewer is running such old code, the upgrade output and the message at the next session start
tell the agent to restart it, with the port and the command. The agent does it without asking
you. A viewer on 1.131.63 or later restarts itself, and no notice is shown.

## 1.131.63 — The viewer picks up new code by itself

After an upgrade, or any change to the journal's Python files, a running viewer kept serving the
old code until someone stopped it and started it again. Now it notices the change, waits until
the files have stopped changing, and restarts itself on the same port. Pages that are open keep
working: they reconnect on their next refresh. Changes to the viewer's own page files never
needed a restart, and still do not.

AGENT, DO THIS YOURSELF: if this project's web viewer was already running when you upgraded, it is
still on the old code and cannot restart itself. Restart it once now, without asking the user:
stop the process listening on its port and run `.journal/journal.py serve` again in the
background. After that it keeps itself up to date.

## 1.131.62 — Activity says what the agent is waiting on

When the agent waited on something (a subagent, a build, a review), Activity said only
"Waiting on something". It now shows what the agent named, for example "Waiting on · the
reviewer subagent finishing", and the footer under the agent's status reads the same.

## 1.131.61 — Jump between the journals running on this machine

Each project's viewer runs on its own port, so with two projects open you had to know which
port belonged to which. A viewer now finds the other journal viewers running on this machine.
When there is more than one, click the name at the top of the sidebar: it lists every running
journal with its project, port and version, and clicking one opens that viewer. A project
on an older version is opened in its own viewer, so it shows that version's pages. A viewer
older than 1.131.57 cannot be found this way.

## 1.131.60 — `journal serve` takes the next free port

When another project's viewer already held port 8420, `journal serve` stopped with "port 8420
is already in use". Two projects on one machine could not both have a viewer without someone
picking a port by hand. Now `journal serve` starts on 8420, or on the next free port up to 8439,
and prints the URL it took. `journal serve --port=<n>` still uses exactly that port and says
so when it is taken.

## 1.131.59 — Enter sends a message

In the Messages page's message box and the Activity column's box, Enter now sends and
Shift+Enter starts a new line, like most chat apps. Before, Shift+Enter sent and Enter only
added a line. Cmd+Enter and Ctrl+Enter still send. While you are composing text with an input
method, Enter confirms the text instead of sending.

## 1.131.58 — The upgrade notice no longer says it runs the tests

The notice that a newer journal is available said `journal upgrade` "runs its tests first",
and the help said the same. It does not: an upgrade copies the package in and runs nothing.
Agents read the notice and told their users otherwise. The notice, the help and the installer's
own text now say what happens. `.journal/install.py --from=… --test` still runs the suites
first, for the times you want that.

## 1.131.57 — A session is told about its own project's viewer only

At a session start the journal told you "the web viewer is running at …" whenever anything
answered on the viewer's port, even a viewer serving a different project. So a second project
on the same machine was pointed at the wrong journal. The viewer now says which project it
serves, and a start only reports it when it is this project's. Restart a viewer that is
already running to pick this up; until then it is trusted as before.

## 1.131.56 — `journal claude` starts Claude with the channel

Using the channel meant typing `claude --dangerously-load-development-channels server:journal`
every time. `journal claude` does it for you: it adds the channel to `.mcp.json` if it is not
there yet, then starts Claude with the flag from the project folder. Pass a first prompt as
words (`journal claude fix the build`), `--continue` or `--resume=<id>` to pick a session back
up, and `--dry-run` to see the command without running it. It is not called `journal start`
because that already starts a piece of work.

## 1.131.55 — An upgrade leaves the source's Claude Code config behind

Upgrading from a git checkout copied every tracked file, and that included the checkout's own
`.mcp.json` and `.claude/` folder: its channel setup, its hook settings and its installed
skill copies. They landed in `.journal/`, where nothing reads them, and would have gone out
to every project that upgrades from it. They are no longer copied. The skill still installs
from `skill/`, and your project's `.claude/settings.json` is still set up the usual way.

## 1.131.54 — A continued session starts back on its environment

Quitting Claude freed the session's environment, and `claude --continue` or `--resume` then
started the same session on no environment. The agent had to run `journal switch` again
before it could write anything, and the channel could not tell which environment it was
for. Now the environment a session was on when it ended is remembered, and a continued or
resumed session is put straight back on it, as long as that environment still exists.

## 1.131.53 — The channel wakes a session that has not picked an environment yet

A session starts on no environment until the agent runs `journal switch`, and the channel
pushed nothing to a session like that. So a session started or continued with the channel
flag heard nothing: an idle agent that had not switched yet, which is exactly when it needs
waking, was never told about a message, an answer or a comment. Now a session on no
environment is woken for what is waiting on every environment, and each push names the
environment it is for.

## 1.131.52 — The channel wakes an idle session for answers and comments too

With the channel installed (`journal channel --install`, then Claude started with
`--dangerously-load-development-channels server:journal`), an idle session was woken only
when the user left a message. Answering a question or leaving a comment in the viewer woke
nothing, and the agent learned about it only at its next stop. Now an answered question and a
new comment are pushed as well, once each. A question whose answer is changed is pushed again.

## 1.131.51 — An upgrade from a checkout copies only the package

`journal upgrade --from=<a git checkout>` copied every file in that folder that was not
project data, including folders that have nothing to do with the package: an editor's `.idea`,
a browser tool's `.playwright-mcp`. From a git checkout it now copies only what git counts as
the package: tracked files, and new files that are not ignored. Stray folders an earlier
upgrade copied into `.journal/` are removed by the upgrade after this one.

## 1.131.50 — An Archive button on every list

To-dos, Messages, Questions, Suggestions, Reports, Open work, Reminders, Pins and Rules have an
Archive button in the top bar. It opens the same list showing only the items that closed more
than a week ago, and "Close archive" goes back. An item opened from the archive stays in it.
Processed messages and accepted suggestions now count as closed too, so they leave their list
after a week like everything else.

## 1.131.49 — Closed items stay in a list for a week

Lists used to hide their closed items (Done, Answered, Struck, Ended, Retired, Declined,
Withdrawn, Archived) behind a "Show …" switch, and switching it on showed every closed item ever.
The switch is gone. Each list now shows its closed section with only the items closed in the
last 7 days. Anything older is out of the list, and the next release adds an Archive button to
reach it. Documents are never archived, so superseded and archived documents stay listed.

## 1.131.48 — Every list knows when its items closed

The first step toward the Archive. Every list the viewer shows now says when each closed item
closed, in a `closed_at` field on its rows: when a to-do was done, work ended, a message was
processed or archived, a question answered or withdrawn, a suggestion decided, declined or
withdrawn, a report archived (or aged out under its keep setting), and a pin, rule or reminder
struck. Nothing on screen changes yet. The next releases use it to keep only the last week of
closed items in each list and move the rest behind an Archive button.

Striking a pin or a rule from the viewer did not record when it was struck. It does now. A pin
or rule struck before this has no time and counts as long closed.

## 1.131.47 — A working agent is marked in the accent colour, not green

The dot that says an agent is working, in the Environments list and the sidebar footer, was a
bright green. Green already means "done" elsewhere in the viewer, and it read like a random
colour for that environment. The dot now uses the viewer's indigo accent, with a slow, soft
pulse, so it reads as "working right now". An environment with no agent keeps a plain grey dot,
and green is left for done.

## 1.131.46 — Mark a document final, or back to a draft, in one click

A document's status could only be changed inside its Edit form, from a select. A document's page
now has its own button: **Mark final** on a draft, and **Mark as draft** on a final one. One click
changes it. The Edit form now holds just the abstract.

## 1.131.45 — A question's options can explain themselves

An option on a question was a single line, so the reasoning behind a choice, or what it would
look like in code, had to be squeezed in or left out. An option can now carry a description
and a code example:

    journal questions add "Where does the cache live?" \
      --option="In memory" --option-description="Fast, lost on restart" \
      --option="On disk" --option-description="Survives restarts" --option-code="cache = DiskCache('.cache')"

`--option-description` and `--option-code` belong to the `--option` in the same position. Leave
either out for an option that needs none. The viewer shows each description under its option
and the code in a code block. Choosing an option still answers with its label, and options
written before this still show as they were.

## 1.131.44 — Home's to-dos switch reads Open / Done

Home's to-dos section switched between "Open" and "Recently finished" with two separate
buttons. It is now a single radio control reading **Open** and **Done**: click one, or move
between them with the arrow keys. The control is reusable, so any other one-of-a-few choice in
the viewer can use it too.

## 1.131.43 — Home shows the work that just ended

Home's Open work section showed only the work in progress, so once a piece of work ended it
disappeared from Home. The last few pieces of ended work now show under the open work, in
smaller, muted text, each with when it ended. Click one to open that work.

## 1.131.42 — Rewording an answered question asks it again

The journal skill says that rewording a question after it was answered means you are asked
again, but the question stayed answered and never showed as open. Now
`journal questions edit <n> "<new wording>"` on an answered question opens it again. The old
answer is kept under the question's earlier answers, and the question shows as open in the
terminal and the viewer until you answer it. Changing only a question's options or the
agent's pick leaves its answer alone.

## 1.131.41 — No outline on a focused select

Clicking a select, such as a list's sort control or a choice in a form, drew the browser's
outline around it. That outline is gone. When you move to a select with the keyboard, a form's
select still turns its border the accent colour, and the sort control gets a soft background,
so you can see where you are.

## 1.131.40 — Comments are cards with room around them

In a panel's Comments section, the comments ran together, and the last one sat right on top
of the comment box. Each comment is now its own card with space between them, and a small
line under the text says who wrote it and when, and whether the agent has seen it. There is
room between the last comment and the box for writing a new one.

## 1.131.39 — Follow up on a message with a comment

A message could not be added to once sent, except by sending another message. A message's
panel now has a Comments section, the same as a to-do's or a document's. Write a follow-up
there, like "it only happens on Safari", and the agent is told about it at its next stop,
naming the message. From the terminal: `journal comments add "message 5" "<text>"`.

## 1.131.38 — Add files to a message after sending it

Once a message was sent, there was no way to add a file you forgot. A message's panel now
has **Attach files**, and the terminal has `journal messages attach <n> --file=<path>`. The
files are kept with the message like the ones sent with it. A file you add from the viewer
also leaves a comment on the message ("added notes.txt to message 5"), so the agent hears
about it at its next stop. This works on a message the agent already processed too.

Comments can now be about a message too: `journal comments add "message 5" "<text>"`.

## 1.131.37 — Remove a file from a message

A file attached to a message could be filed into a document or kept, but not taken off. Each
file in a message's panel now has a **Remove** button that asks why, and the terminal has
`journal messages detach <n> <name> "<why>"`. The file is not deleted: it moves to a `struck`
folder beside the message's other files. The message still lists it, marked as removed with
your reason. A removed file no longer counts as waiting to be filed, and it leaves the Files
page.

## 1.131.36 — Every stored file in one place

Files lived in two places you had to open one by one: attached to a message, or attached
to a document. Each environment now has a **Files** entry in the sidebar that lists every
stored file there, including the files on its messages and the attachments of its documents.
Each file shows where it came from (message 12, document 4), its size and age, a small preview
for images, and a link that opens it. The documents list also shows how many files each
document holds.

## 1.131.35 — The refresh highlight marks only what changed in the background

Lists outlined a row in blue whenever it arrived or moved, including right after you saved
something yourself, when there is nothing to point out. Now only changes that come in while
the list refreshes on its own are marked, such as the agent closing a to-do or filing a
message. Your own saves are not marked.

The mark is a soft tint instead of an outline:

- **Coming in:** a row new to the list, or arriving in another group, is tinted blue and
  settles.
- **Going out:** a row leaving the list, or leaving its group, is tinted amber and fades away
  before it goes.

In Home's rounded lists the tint keeps the rounded corners. With reduced motion switched on,
the tint shows without fading.

## 1.131.34 — A stray character is gone from the viewer script

1.131.33 left an invisible NUL character in `static/app.js`, inside the marker for the Custom
answer option. Browsers ignored it, so the viewer worked, but tools like `grep` treated the
whole file as binary and found nothing in it. The marker is now written without it. Custom
answer works the same.

## 1.131.33 — A custom answer is one of the options

A question with options had its options, and a separate box underneath for writing your
own answer. The list of options now ends with **Custom answer**. Pick it like any other
option and a text box opens inside it. The same **Save answer** button sends either the
option you picked or the text you wrote. Questions without options keep their answer box
as before.

## 1.131.32 — Document parts are blocks you can edit

On a document's page the parts ran together, so it was hard to see where one ended and the
next began, and a part could not be changed from the viewer. Each part is now its own
bordered block, with its number, title and age in a header. The header has an **Edit**
button, shown on hover and reachable with the keyboard, that opens the part's text in place.
Saving replaces the text, the same as `journal docs replace <doc>.<p>`, and the old text is
kept under `struck/`. Cancel leaves the part as it was.

## 1.131.31 — The footer says whether the agent is working

The sidebar footer's dot blinked for any agent seen in the last day, and during a long tool
call the latest Activity line's age kept growing, so a busy agent looked like it had stopped
minutes ago. The footer now says **Working** or **Idle** beside "Agent". It reads Working from
the moment a tool call or turn starts until the agent stops and waits for you, however long
the call takes. The dot blinks only while it is working.

## 1.131.30 — Activity lines from the same second read newest first

When the agent ran two journal commands within the same second, Activity listed the earlier
one on top. Lines from the same second now follow the order they happened, newest first,
like the rest of the list. A summed tool line such as "Ran 2 commands" still sits under the
journal command that ended its count.

## 1.131.29 — Activity sums up the agent's other tool use

Activity showed the journal commands the agent ran, but not the rest of its work between
them: shell commands, edits, reads, searches. Those are now counted as they happen and shown
as one line, like "Ran 4 commands, edited 3 files, read 2 files". The line is written after 10
tool uses, or as soon as the agent runs a journal command, whichever comes first. A journal
command run through the shell counts as that journal command, not as a queued command.

## 1.131.28 — Message the agent from the Activity column

Sending a message meant going to the Messages page. The Activity column now has a small
"Message the agent" box at its bottom. It grows while you type, and it sends the same message
the Messages page does. **Shift+Enter** (or Cmd+Enter) sends, the same as the message box on
Messages, and Enter starts a new line. After sending it clears, and your "Wrote message"
line appears in Activity above it. The list scrolls above the box, and the box never covers
its last line. Attaching files stays on the Messages page.

## 1.131.27 — To-do rows show when they have a question

A to-do with a question linked to it looked the same in the list as any other. Its row now
shows a small question icon right after the number: in the warning colour while a question
waits on your answer, faint once every question is answered, and nothing when it has no
questions. Hover it for the count. It shows in the to-do list on the To-dos page and on
Home.

## 1.131.26 — A to-do's work log opens its work

In a to-do's panel, the Work log listed when work started, was updated, waited and ended,
with no way to get to that work. Each entry now ends with the work's number, like "Work 180",
and clicking the entry opens that work item.

## 1.131.25 — Reading a comment says what it is on

When the agent read one comment, Activity showed "Reading comment · 3" and nothing about where
that comment was. The line now names what the comment is on, like "Reading comment · 3 ·
to-do 98". Clicking the line opens that to-do, document, pin, rule or reminder.

## 1.131.24 — Work records the files it changed

While work is open, every file the agent changes is recorded on that piece of work, with the
lines added and removed and whether the file is new. This covers Edit and Write, and shell
commands too: a command's changes are measured with git before and after it runs, and a
command that commits is not counted as an edit. Files outside the project and inside
`.journal/` are left out.

The work panel in the viewer lists them under **Files changed**. `journal open` lists them
under each piece of open work, and the **Ended work** line in Activity says how many files
changed.

## 1.131.23 — Every resource page explains itself

Each resource page now has a small ⓘ button beside its title: to-dos, messages, questions,
suggestions, reports, pins, reminders, work, documents, rules and tools. It opens a short,
plain explanation of what that page holds, who writes it, and what you can do there. The
text lives in Markdown files under `static/help/`, one per page, so it can be edited without
touching the code.

## 1.131.22 — Rows fade in and out of lists

Rows used to pop in and out of lists. They now come in and go out smoothly:

- When a list opens, its rows rise and fade in one after another, quickly.
- A new row, a row moving to another group, and the rows "Show more" adds come in the same way.
- A row that leaves a list fades out after its moment on screen, and the rows below slide up
  into its place instead of jumping.
- An ordinary refresh that changes nothing does not animate.

With reduced motion switched on in your system, rows show and hide instantly as before.

## 1.131.21 — Home's lists keep their titles beside an open panel

When a panel was open beside Home's lists in a narrow window, the titles disappeared: the
columns for what a row is about and its age kept their full width, leaving the title no room.
Home's lists now narrow those columns the way the other list pages already did, so the title
stays readable.

## 1.131.20 — Home uses the full width until you pick something

On Home an empty inspector panel took up the right side even when nothing was picked. The
panel now appears only when you pick a row, and otherwise Home's lists use the full width.

## 1.131.19 — A row's highlight fits inside rounded lists

When a new or moved row was lit in a list with rounded corners, the corners cut off its
highlight. The highlight now has rounded corners of its own, just inside the list's, so it
shows in full on the first and last rows too.

## 1.131.18 — Suggestions has a top bar icon

The agent's suggestions were reachable only from the Notifications drop-down. Suggestions
now has its own icon in the top bar, a light bulb beside Reports, Pins and Reminders. It
opens the Suggestions page and is lit while you are on it. Open suggestions still show under
Notifications.

## 1.131.17 — The Agent and Auto mode rows are the same height

In the sidebar footer the Auto mode switch made its row taller than the Agent row above it.
Both rows now have the same height, and the Auto mode label is centred in its row.

## 1.131.16 — The ideas setting is gone

`idea_max_chars` belonged to the ideas command removed in 1.131.0 and no longer did anything.
It is no longer a setting. If your `.journal/settings.json` still sets it, the journal
reports it as an unknown key, and you can delete that line.

## 1.131.15 — The message box is ready to type in, and Shift+Enter sends

Opening the Messages page puts the cursor in the message box, so you can start typing
straight away. In any message, answer or comment box, Shift+Enter sends, as Cmd+Enter and
Ctrl+Enter already did. Enter on its own still starts a new line.

## 1.131.14 — The Auto mode row matches the Agent row

In the sidebar footer the Auto mode label was larger and brighter than the Agent label above
it, and its divider was darker. It is now smaller and the same muted colour, and its divider
matches the one under Agent.

## 1.131.13 — Updated work in Activity shows what moved

An "Updated work" line in Activity named only the work's number. It now shows the note the
agent filed underneath, the same way "Started work" shows the subject.

## 1.131.12 — Auto mode switch in the sidebar footer

The sidebar footer has an Auto mode row with a switch that turns auto mode on or off for the
environment, the same setting as on the Settings page.

## 1.131.11 — Change answer, and the agent's pick

An answered question in the viewer used to leave its options clickable, so a stray click
could start a new answer. Now its options are read-only, with the chosen one marked, until
you press Change answer. Cancel puts it back.

`journal questions add ... --option="<a>" --option="<b>" --pick=2` records which option the
agent recommends, and the viewer marks that option with an "Agent's pick" band. Agents stop
writing "(my pick)" into option text. `questions edit` takes `--pick` too.

## 1.131.10 — The sidebar footer shows how much context the agent has used

While an agent is working, the footer's Agent row shows how full its context is, as a
percentage with a thin bar. The bar turns the warning colour from 70%. Hover it for the token
count. Nothing shows when no agent is working or the context window is unknown.

## 1.131.9 — A priority line in Activity names the level

A priority change in Activity showed the number, like "Changed to-do priority · 174 · 100".
When the number is a named level it now shows the name: low, default, high or critical.
Any other number still shows as it is.

## 1.131.8 — The message box sits at the bottom of Messages

On the Messages page the box for a new message was at the top, above the list. It now sits
at the bottom like a chat box, and only the list above it scrolls.

## 1.131.7 — Your changes in the viewer show in Activity

Activity listed what the agent ran and what the stores recorded, but a change you made in
the viewer, like a to-do's priority, left no line. Every write made in the viewer is now an
Activity line by You, such as "Changed to-do priority · 164 · low" or "Accepted suggestion · 3".

## 1.131.6 — A bigger attach icon

The paperclip inside the message box was small and faint, and hard to recognise as an attach
button. It is now larger and darker.

## 1.131.5 — Reminders has its own icon

In the top bar the Reminders icon was a bell, the same as the Notifications bell beside it.
Reminders now shows a clock with a looping arrow, and the bell is only Notifications.

## 1.131.4 — Reports, Pins and Reminders move to the top bar

The sidebar now lists what the user reads and manages: Home, Messages, To-dos, Documents
and Settings. Reports, Pins and Reminders, which hold what the agent keeps, are icons in the
top bar after Questions; each opens its page and is lit while that page is open.

## 1.131.3 — A Questions icon in the top bar

The top bar has a Questions icon between Search and Notifications. It opens the questions
page and shows how many questions are waiting on you. Questions is still not in the
sidebar.

## 1.131.2 — Attach files sits inside the message box

The button for attaching files to a message is now a small paperclip in the top-right
corner of the message box itself, instead of a button in the bar under it. Text in the box
keeps clear of it. Picked files still show under the box.

## 1.131.1 — A to-do's priority is one button with a menu

In an open to-do's panel the Priority row shows the current priority's icon and name as one
button. Clicking it opens a small menu of Low, Default, High and Critical with their icons,
the current one marked; choosing one saves it and closes the menu, and a click elsewhere or
Escape closes it without a change. It replaces the four icons shown side by side.

## 1.131.0 — The ideas command is gone

`journal ideas` (add, list, drop, promote) and `journal idea` are removed, with their help,
their Activity lines and their tests, as the user decided. Ideas already written stay in the
record untouched; nothing reads them anymore. A stray thought now goes where it fits: a
to-do when it is work, a pin or a note in a message when it is not.

Running `journal messages waiting` shows in Activity as "Checking for new messages"; lines
logged as "Reading waiting messages" show the new wording too.

## 1.130.1 — The agent hears about new comments between stops

A comment the user adds is now mentioned to the agent after its next tool call, the same way
a new message is: "the user left 1 new comment(s) — `journal comments` reads them". Before,
comments were only raised at a stop, and a stop shows one reminder at a time with waiting
messages ahead of comments, so while messages kept arriving the comments were never raised.

## 1.130.0 — Set a to-do's priority from the viewer

The New to-do form has a Priority field (Low, Default, High, Critical). In an open to-do's
panel the Priority row is a row of four priority icons: click one and the priority is saved
at once and the list re-sorts. A done to-do shows its priority without the picker.

## 1.129.0 — journal messages waiting: only the messages still waiting, in full

`journal messages waiting` prints every message that is still waiting to be processed,
oldest first, each in full with its files and the commands to process it, or "No messages
waiting." when there are none. The stop hook's reminder points at it, so the agent reads
exactly the messages that need handling instead of scanning the whole list.

## 1.128.7 — A closed to-do says plainly how it was closed

A to-do closed by `work end --todo` now reads "Closed: its work ended" instead of "Closed:
closed with the work that finished it"; to-dos closed that way before show the new wording
too. A to-do closed by a commit trailer reads "Closed: commit 60c651f1a: <the commit's
subject>", so it is clear a commit closed it.

## 1.128.6 — The sort control in list headers is smaller and sits at the right edge

In each list group header, the sort field and its arrow are smaller and fainter, and they
sit close to the header's right edge instead of behind wide padding. Hovering brings them
back to full strength. The sort field shows only its name, without a chevron; clicking it
still opens the choices.

## 1.128.5 — An answered question no longer looks open in Activity

Once a question is answered, its "Asked question" line drops the ember card, says "answered"
after its number and takes the same light tint as the "Answered question" line. A withdrawn
question's line says "withdrawn". An open question still shows the ember card with Answer.

## 1.128.4 — Home keeps four statistics

Home's counts are now Message queue (messages waiting), Questions for you, In progress and
Blocked. Suggestions is no longer counted on Home; its waiting ones are in the top bar's
Notifications.

## 1.128.3 — The sidebar footer's divider runs edge to edge

The line under "Agent" and the status dot now reaches both edges of the sidebar, and it is
fainter than the other dividers. "Agent" and the dot keep their place.

## 1.128.2 — Questions in Notifications are links, not answer forms

In the top bar's Notifications list an open question is now one short row, "Question 14"
and its text, like a suggestion. Clicking it opens the to-do or other item the question is
about, where it can be answered, or the question page when it is about nothing. The answer
box stays in panels only.

## 1.128.1 — The sidebar footer: Agent with a blinking dot, a divider, then what it is doing

The agent status at the bottom of the sidebar has a top row with "Agent" on the left and the
status dot at the far right; the dot blinks while an agent is working and is a grey ring
when none is. A faint line divides that row from the agent's latest activity and its time
below. With reduced motion on, the dot does not blink.

## 1.128.0 — Comments show up in Activity, yours and the agent's

Writing a comment is now an Activity line, "Wrote comment", by You when it was written in
the viewer and by Agent when it came from the command line, with the comment's text under
it. Marking a comment handled shows as "Handled comment". A comment line opens the to-do,
message or other item the comment is about.

## 1.127.4 — The sidebar footer is tighter, and its lines line up under "Agent"

The agent status box at the bottom of the sidebar has less padding, so its content sits
closer to the edges. The latest activity and its time now start where the "Agent" label
starts, under it, instead of at the box's edge.

## 1.127.3 — "Reading your messages" reads "Reading messages"

Reading the message list shows in Activity and the sidebar footer as "Reading messages".
Lines logged earlier with the old wording show the new wording too.

## 1.127.2 — Sorting picks its field from a flush select, with a plain arrow

Each list group header chooses what it sorts by (ID, Priority) from a select with no border,
sitting level with the header text. The direction button beside it is a single up or down
arrow.

## 1.127.1 — List titles stay visible with a panel open

With an item's panel open on a list page, the list sat between the panel and the Activity
column and its rows lost their titles, showing only numbers and ages. The panel now narrows
on smaller windows, and a list narrower than 600px drops its cite column and narrows its age
column so the titles keep their room.

## 1.127.0 — Questions are answered where they show up, not from a sidebar page

Open questions now appear in the top bar's Notifications list, counted in the bell's badge,
and can be answered right there: pick an option and Save, or write an answer. A to-do,
message or other item that an open question is about shows the same answer box under the
question in its own panel. Questions is no longer in the sidebar; its page still opens from
links. The question panel, the notifications list and those inline spots share one answer
component.

## 1.126.0 — Search inside one resource: journal todos search <term>

To-dos, messages, questions, reports, suggestions, reminders, pins, rules, work and
comments each have a search: `journal todos search lantern` lists every line of the open
to-dos that mentions "lantern", grouped by to-do, with the word marked. Closed items are
left out and counted; `--all` includes them. Searching ignores case and pages at 25 lines.
`journal search` still reads the transcript and `journal docs search` the documents.

## 1.125.0 — Every command the agent runs has a plain Activity line

All 168 journal commands now have a plain description in Activity. Before, 102 of them
showed as "Running journal <command>". Where a value matters, it follows the number:
setting a priority reads "Setting to-do priority · 140 · high", switching environment
names the environment.

The sidebar footer reads top to bottom: the dot and "Agent" (the dot is green while an agent
works, a grey ring when not), then the agent's latest activity as plain words with its
number and value ("Setting to-do priority 140 high"), then how long ago it was.

"Processed message" is now "Filed message", followed by what the message became: "Filed
message · 118 · to-do 139", or "question 12", "work update", "noted".

## 1.124.1 — The agent status dot reads clearly as working or not

The small marker beside "Agent active" in the sidebar footer and beside each environment
name is now a round dot: solid green with a soft pulse while an agent is working, an empty
grey ring when none is. It was a faint square with a green edge. With reduced motion
turned on, the dot stays still.

## 1.124.0 — Lists sort by a field, with an arrow that flips the direction

Each list group's header shows what it sorts by, "ID" or "Priority", as buttons (or just
the label when there is one choice), and an arrow button beside it that switches between
ascending and descending. "Number" is now called "ID". The dropdown is gone.

## 1.123.3 — The footer's latest-activity line starts at the left edge

The italic line under "Agent active" in the sidebar footer starts at the footer's left
edge, under the status dot, instead of being indented to line up with the status text.

## 1.123.2 — The number after an Activity line is fainter

The "· 114" after a line's wording is fainter, so the wording reads first.

## 1.123.1 — The same Activity line twice in a row shows once

When the agent runs the same thing again right away, like reading a message a second time
for more context, Activity shows one line instead of two. The same action with other lines
in between still shows each time.

## 1.123.0 — Activity lines that need you stand out, with their action

A question the agent asked and you have not answered shows in Activity as an ember card
with an Answer button. A suggestion waiting on you shows the same way, with Accept and
Review. Once a question is answered, its "Answered question" line keeps a light tint.
Suggestions now have their own line, "Suggested a change".

The item's number now follows a line's wording after a dot, smaller and muted, without a
"#": "Closed to-do · 98".

The line under "Agent active" in the sidebar footer is smaller, in italics and fainter, so
it reads as what the agent is doing rather than a second status.

## 1.122.1 — The sidebar footer says what the agent did last

Under "Agent active just now" at the bottom of the sidebar, a short line gives the wording
of the agent's latest Activity line, like "Reading your messages" or "Started work".

Activity lines logged with the number still in their wording ("Filing message 108") now
show the wording alone, with the number on the right like every other line.

Two lines read more plainly: a note on work is "Updated work" (beside "Started work" and
"Ended work"), and a message you send is "Wrote message".

## 1.122.0 — Activity lines show the number on the right, and titles only where they add something

Each line's wording no longer carries the number: "Closed to-do" with a muted "#98" on the
right. The item's title shows under a line only when the line introduces something (Left
message, Added to-do, Asked question, Started work, a new report or document). Lines that
read, file or close something already shown have no second line, so a message's text is
not repeated under every line about it.

## 1.121.0 — Activity can be hidden, and brought back from the top bar

The Activity header has a button that hides the column. An Activity button in the top
bar, after the Notifications bell, shows or hides it on every page. The choice is
remembered in this browser.

## 1.120.1 — Activity has a header like the page's top bar

The Activity column's header is as tall as the page's top bar and lines up with it, with a
divider under it where the list begins.

## 1.120.0 — Search and Notifications live in the top bar

Every page's top bar keeps its crumbs on the left. On the right come the page's own button
(New to-do, Start work), then a Search button and a Notifications bell. The bell shows how
many notifications and suggestions are waiting; clicking it opens a list where a suggestion
opens its page and a notification can be marked read. Search and Suggestions are no longer
in the sidebar; their pages still open from links.

## 1.119.2 — Home shows only the counts that call for something

Home's counts are now: messages waiting, questions for you, suggestions, to-dos in
progress and blocked to-dos. Open to-dos, pins, reminders and documents are gone from
Home; their pages still show them.

On windows narrower than 1440px, Home's empty panel column is hidden until you pick a row,
so the list has room for its titles beside the Activity column and the counts fit on one
line. Wider windows keep the empty column with its faint icon.

## 1.119.1 — Older Activity lines open what they name too

Lines logged before 1.118.0, like "Filing message 101", had no link. What they name is now
read from their text, so they open it and show its title like newer lines.

The title under a line wraps onto more lines instead of being cut off at the edge, and
shows up to 200 characters.

## 1.119.0 — Each Activity line shows the title of what it names

Under "Processed message 97" or "Closed to-do 98", a smaller line gives that item's title:
the to-do's title, the message's first words, the question, the work, the report, the
suggestion, the document, the pin or the rule. Lines about a list ("Reading your
messages") have no second line.

## 1.118.0 — Activity lines for commands open what they name

A line like "Filing message 95" or "Reading to-do 98" now opens that message or to-do. A
line without a number, like "Reading your messages", opens that list. Lines logged before
this version stay as plain text.

## 1.117.0 — Activity shows the last 50 lines, and both numbers are set in Settings

Activity lists the last 50 lines instead of 12, scrolling where they do not fit. The
environment's Settings page has an Activity section: how many lines Activity shows
(default 50) and how many the activity log keeps before removing the oldest (default 250).

## 1.116.0 — Activity is an always-visible right column

Activity sits in a fixed column on the right of every page, full height, and only its list
scrolls. The left sidebar is navigation only, with the "Agent active" line at its bottom.
The sidebar, floating and docked choices are gone, and so is the floating window.

## 1.115.5 — Activity leaves out the commit hook's own command

A commit ran `journal todos from-commit` through the git hook, and Activity showed it as
"Running journal todos from-commit". Commands run by git hooks are no longer logged.

## 1.115.4 — Blocked to-dos are listed above open ones

On Home and on the To-dos page, the Blocked group now comes before Open: In progress,
Waiting on the user, Blocked, Open, Done.

## 1.115.3 — Both docs entries are called Documents

The sidebar's "Environment docs" and "Project docs" both read "Documents"; their group
already says which is which. Page crumbs and Home's count say "Documents" too.

## 1.115.2 — The sidebar footer fits on screen

The footer that says whether an agent is working was pushed below the bottom of the sidebar.
It now fits, and reads "Agent active just now" instead of "Agent working · active just now".

## 1.115.1 — Activity shows only activity; whether an agent is working moves to a footer

The agent's latest chat text and its "active" line are gone from the Activity panel. A small
footer at the bottom of the sidebar says "Agent working · just now" or "No agent working".

## 1.115.0 — Work links to the to-do and document it was for

A work item names the to-do it was started for (or the to-do with its title) and that
to-do's document. The work panel links to both, and the work list shows them beside the
subject.

## 1.114.1 — Only the sidebar's Activity list scrolls

The sidebar no longer scrolls as a whole. The Activity section fills the space under the
navigation, its header stays put, and only its list of events scrolls.

## 1.114.0 — Activity shows each journal command the agent runs, in short plain words

When a session runs a journal command, Activity gets a line for it: "Reading your messages",
"Reading to-do 98", "Filing message 91". Writes that already show from what they change are
not repeated, and the status line is never logged. Up to 250 lines are kept per environment.
Activity lines are short and name only the number: "Closed to-do 98", not its title.

## 1.113.2 — Activity rows show in full, with who did it; times are never cut off

Each Activity row shows its whole text (at most 100 characters, cut at a word) with a small
line under it saying who did it and when: "You · 18 minutes ago" or "Agent · just now". A
to-do closed from the viewer counts as yours. The age column in lists is wide enough for
"18 minutes ago" and is no longer cut off.

## 1.113.1 — Home's empty panel column shows a faint icon

When nothing is open, Home's panel column shows a faint empty icon instead of the sentence
"Select a row to see it here."

## 1.113.0 — a message you leave can wake an idle session

The journal ships a channel server, `.journal/channel.py`. `journal channel --install` adds it to
the project's `.mcp.json`; start Claude with `claude --dangerously-load-development-channels
server:journal` (channels are a Claude Code research preview). When you leave a message in the
viewer and auto mode is off, or the session is idle, the message is pushed into that session and
it starts working on it; while auto mode is on and the agent is working, the stop hook tells it as
before. The hook records each session's last event so idle can be told apart from busy.

## 1.112.0 — a report can be turned into a document

A report's page has Turn into doc: a document is made from the report's title and text and kept
for good, and the report is archived, pointing at it. From the terminal, `journal reports doc
<n>`. This is how a report outlives the 30-day removal.

## 1.111.1 — session start is fast again

Session start took several seconds on machines with many Claude projects: looking up a session
whose transcript was not in this project's folder searched every folder under
`~/.claude/projects`. It now checks this project and this repository's other checkouts only, so a
lookup takes milliseconds and session start about 200 ms. The test suites write their fake
transcripts to a temporary folder instead of `~/.claude/projects`. A failed update check now waits
fifteen minutes before trying again, so an unreachable GitHub no longer slows every stop.

## 1.111.0 — anything closed more than 30 days ago is removed

Once an hour, each session sweeps its environment: ended work, processed or archived messages,
answered or withdrawn questions, handled comments, read notifications and decided suggestions
that closed more than 30 days ago lose their content for good, and done to-dos older than that
are deleted. Each removed item keeps its place and its closed status, so numbers do not shift and
nothing reopens; it no longer shows in any list. Documents are never removed.

## 1.110.0 — reports are archived after 7 days and removed after 30

A report is archived 7 days after it is written (the default on the environment's Settings page
is now 7), and removed for good 30 days after it is written: its title and text are deleted, and
its number is kept so other reports keep theirs. To keep a report, make it a document (coming).

## 1.109.2 — a report opens on its own page

Clicking a report in the viewer opens it on a full page, like a doc: its title, when it was
written, what it answers, Archive, and the text at full width. All reports takes you back to the
list; New report still opens beside the list.

## 1.109.1 — "just now" means the last minute

An age says "just now" for the first minute, then "1 minute ago", "2 minutes ago" and so on up
to an hour, then hours and days, in the terminal and in the viewer. The same minute applies to
"active just now" on environments and agents. 1.94.1 had made it five minutes.

## 1.109.0 — the Activity panel can float or dock on the right

Three small buttons in the Activity panel's header choose where it shows: in the sidebar (as
before), as a floating window you drag by its header anywhere on the page, or docked as a column
on the right. Floating or docked, it lists up to 20 events instead of 6. The browser remembers the
choice and where the window was left. Activity no longer folds. On narrow screens the docked
column is hidden, like the sidebar.

## 1.108.1 — an activity row opens what it is about

A row in the sidebar's Activity section that is about a to-do, question, message or piece of
work is now a link to it. Work events carry the number of the work they are about, so "Started
work", its notes and "Ended work" open that work. Rows about nothing with a page stay plain text.

## 1.108.0 — reports archive themselves after a set number of days

A report older than the environment's setting — 30 days unless changed — is off the reports
list and shows under `--all` as archived, "older than N day(s)". Nothing is written or deleted:
raise the number, or set 0, and the report is listed again. Set it on the environment's
Settings page in the viewer, or with `journal reports keep <days>`.

## 1.107.1 — opening a panel on Home no longer moves the page

Home keeps a column for its side panel at all times, about a quarter of the width, showing
"Select a row to see it here." when nothing is open. Opening a to-do, message, question or piece
of work fills that column, so the stat cards and the sections below keep their size and place;
before, the cards reflowed into two rows and everything below jumped down. List pages were
already stable and are unchanged. On narrow screens the panel still slides over the page.

## 1.107.0 — the agent can reply to a message

`journal messages reply <n> "<text>"` puts a short note under a message: what the agent did
differently than written, a call it made on something left open, or a clarification. It works
on a waiting or a processed message. The message's panel in the viewer lists the replies with
who wrote them and when, and `messages show` prints them. The skill says a reply is optional
and not for "done", which the parts already record.

## 1.106.1 — the sidebar's Activity section runs edge to edge

The sidebar no longer pads its sides as a whole; each section pads itself. The Activity
section's top border now spans the full width of the sidebar, while everything inside it keeps
the same inset as before.

## 1.106.0 — choosing a question's option no longer sends it

Clicking one of a question's options only selects it; a Save answer button sends the choice,
and the panel says "Not sent until you save" while one is selected. Clicking the selected option
again clears it, and opening another question drops a choice that was not saved. Writing your
own answer works as before.

## 1.105.1 — a row that moves after a refresh is shown before it goes

When a list refreshes and a row changes group (a to-do started, done, a message processed) or
leaves the list, it stays where it was for about two and a half seconds with a blue highlight,
then moves. A row that appears in a list already on screen gets the same highlight briefly.
Nothing is highlighted on the first load of a page.

## 1.105.0 — the viewer has a Suggestions page

Each environment has a Suggestions page, listed in the Environment section of the sidebar with
how many wait on you. A suggestion's panel shows what the agent proposes and why, what it is
about, and Accept, Adjust (accept with your change) and Decline; an accepted one links to the
to-do filed from it. Declined and withdrawn ones are hidden until you show them. Comments work
on a suggestion like on any other resource.

## 1.104.0 — Home's side panel is the resource's own panel

A to-do, question, message or piece of work opened from Home shows the same panel as on its own
page, with every action: edit a to-do, answer a question, archive a message, add a note to
work, comment. The panel's title links to the page; the separate Open page button is gone.
Open work on Home now opens its panel too instead of leaving the page. Each panel is one
component used in both places.

## 1.103.0 — the agent is taught to suggest

The skill has a Suggestions section: when the agent thinks something should be done
differently, it files a suggestion instead of saying it, keeps doing the work as asked, never
decides its own, and does not file a declined one again. The session start counts the
suggestions waiting on the user. When the agent's reply proposes a change ("we could…", "it
would be better to…") and it filed nothing since the prompt, the next stop says once that a
suggestion exists for that; never a hold, not when the user asked for an opinion, and quiet
after three in a session. Silence it with `"silenced": ["suggest_hint"]`.

## 1.102.0 — suggestions: the agent proposes, the user decides

`journal suggest "<the change>" [--about="todo 22"] --brief` files a proposal nobody asked for,
with its reasoning on stdin; the work in hand goes on as asked. The user decides each one:
`journal suggestions accept <n>` files a to-do from it, `adjust <n> "<change>"` files a to-do
carrying their change, `decline <n> "<why>"` declines it. Those three are the user's, and are
refused when the agent runs them. The next stop tells the agent what was decided. At most
`suggestion_max_open` (5) wait on the user per environment; a proposal close to a declined one
is refused unless `--despite=<n> --because="<what changed>"` says what changed. The agent can
`withdraw` its own. Questions and comments can be about `suggestion N`. The viewer page and
the skill section follow.

## 1.101.1 — the message box says when no agent will see a message yet

A message reaches an agent only at that session's next hook event, so a message left while no
session is working the environment waits. The viewer's message box now says so under the text
field ("No agent is working on this environment right now; the message waits until a session
picks it up") instead of promising the agent will be told at its next stop.

## 1.101.0 — the agent can notify the user

`journal notify "<what finished>" [--about="todo 22"]` puts a notification at the top of the
user's Home, pointing at the to-do, question, report or doc it is about. It is for what the
user asked to hear about, or a long piece of work that landed, not for progress. The sidebar's
Home entry shows how many are unread; Home has Mark read on each and Mark all read.
`journal notifications` lists the unread ones, `--all` the read ones too, and `notifications
read <n>` marks one read.

## 1.100.0 — a rule can be written into CLAUDE.md

`journal rules inject <n>` writes a rule of this project into the project's CLAUDE.md, inside
`<!-- journal:rules -->` … `<!-- /journal:rules -->` markers, one entry per rule tagged with
its number. The entry is the ruling plus a path to each doc it cites and each project file it
names, never the file's content. `journal rules uninject <n>` takes it out; striking the rule
takes it out too, and `journal disable` removes the whole block. Everything outside the markers
is left as it is. The rule's page in the viewer shows whether it is in CLAUDE.md, with an
Add to CLAUDE.md or Remove from CLAUDE.md button.

## 1.99.1 — the viewer asks the server for less

Every page now reads the one overview the shell already keeps fresh, instead of each page
that lists environment names polling `/api/overview` a second time. The page and `app.js`
are sent with a fingerprint (ETag); a reload of an unchanged viewer is answered 304 with no
body instead of the whole script. They still revalidate on every load, so an upgraded journal
is never shown from the browser's copy.

## 1.99.0 — reports: what the user asked to have checked, written for the user to read

A report is the situation as it was when someone looked: a check, a measurement, a subagent's
research. It is not a doc, and no session is handed one. `journal reports add "<title>"
[--about="todo 22"|"question 4"] --brief` files one with its text on stdin; `journal reports`
lists them, `reports show <n>` reads one, `reports archive <n> "<why>"` takes one off the list
(`--all` still shows it). The viewer has a Reports page for each environment, with the text
rendered, a link to the to-do or question it answers, a New report button and Archive.

## 1.98.0 — a message or a whole doc can be archived

`journal messages archive <n> "<why>"` takes a message off the list with its reason; a waiting
one stops waiting, and nothing is deleted. `journal messages --all` still lists it, and the
viewer shows archived messages in their own group at the bottom, with an Archive button on
each message. `journal docs archive <doc> "<why>"` takes a whole doc off the catalogue, the
session start and search; it stays readable by number, `journal docs --all` lists it with its
reason, and the viewer's doc lists show it under "Show superseded and archived". A part is
still struck, not archived.

## 1.97.1 — the viewer's sidebar sections fold

Each sidebar section (Environment, Project, Environments, Activity) has a header you click to
fold it; the browser remembers which are folded. The environment's own pages sit under an
"Environment" label.

## 1.97.0 — the agent is told when a cleanup report is ready

Once an hour at most per session, the hook runs the cleanup checks itself and tells the agent
in one line when the record has entries with evidence against them: how many, of what kind,
and the commands to read them (`journal cleanup`, then `journal cleanup read` for what only
reading finds). It says so again only when the findings change, and it mentions a due
read-through of the rules and pins when nothing else is found. It is never a hold. The
interval is `cleanup_every_minutes` (default 60, 0 turns it off); silence it with
`"silenced": ["cleanup_report"]`.

## 1.96.0 — a message can carry files

The viewer's message box has Attach files: each file is copied into the environment at once,
under `environments/<env>/inbox-files/<message>/`, so nothing is lost before the agent gets to
it. From the terminal, `journal messages add "<message>" --file=<path>`. `messages show` lists
each file with where it is held. The agent files each one with `journal messages file <n>
<name> "doc <doc>"`, which copies it into the doc and removes the held copy, or with `keep`.
`messages done` is refused while a file is not filed. The message panel lists the files, shows
images inline, and links a filed one to its doc.

## 1.95.0 — the user can comment on a to-do, doc, pin, rule or reminder

Every detail panel in the viewer has a Comments section: the user writes a comment for the
agent, and the next stop tells the agent, straight after the user's messages. The agent acts
on what the comment asks, then closes it with `journal comments done <n> "<what was done>"`.
Each comment shows whether the agent has seen it and what was done. From the terminal:
`journal comments`, `comments show <n>`, `comments add "todo 22" "<text>"`. Comments belong
to an environment; a comment on a doc or rule is filed on the doc's own environment, or on the
most recently active one.

## 1.94.1 — "just now" means the last five minutes

An age says "just now" for the first five minutes, then "N min ago" up to an hour, then hours
and days, in the terminal and in the viewer. It used to say "just now" for a whole hour.

## 1.94.0 — a to-do keeps a log of the work done on it

Work started from a to-do records the to-do's number, whether through `journal todos start
<n>` or through `journal work start` with the to-do's title. A to-do's page, in the terminal
and in the viewer, shows a work log: when the work started, each update, what it waited on,
and when it ended. The viewer's work panel shows when ended work ended.

## 1.93.0 — the user is told about the web viewer, and can see the journal in the status bar

A session start shows the user one line: the viewer's address when it is running, or how to
start it (`journal serve`, or ask Claude). `journal statusline` prints the line Claude Code's
status bar can show: the environment, the open work, and whether the viewer is up.
`journal statusline --install` adds it to `.claude/settings.json`, and never replaces a
status line that is already there; `journal enable` offers it when none is set. Silence the
start line with `"silenced": ["viewer_line"]`.

## 1.92.0 — a doc's attached files are hard to miss

A session start names each doc's attached files beside its title, with `journal docs paths
<doc>` to get them. `journal docs paths <doc>` prints one absolute path per attached file,
a folder's files included, ready to paste into a subagent's prompt. A search for a file that
is attached to a doc (find, grep, rg, ls, Glob, Grep) is answered once with the doc and the
path. A to-do that cites a doc lists that doc's files under its brief. `journal docs title
<doc> "<title>"` retitles a doc. The catalogue flags a doc whose parts or files were added
after its abstract was written; `journal docs abstract` clears it. Silence the search hint
with `"silenced": ["search_hint"]`.

## 1.91.0 — a doc's files can be browsed in the viewer

A doc's page lists its attachments as files: each opens in a new tab (an HTML design, a PDF,
anything the browser can show), images are shown inline under their name, and a folder
attachment expands to the files it holds, each of which opens the same way. The server serves
a file inside a folder attachment only if it resolves inside that folder, which comes from the
doc's manifest.

## 1.90.0 — what came from a message links back to it

When a part of the user's message became a to-do, a pin, a rule, a reminder or a question,
that resource's page now says which message it came from and links to it — in the viewer
("From your message", with the words it quoted on hover) and on a to-do's terminal page
("from the user's message 44"). Nothing new is written: it is read from what the message
already records each part became (`inbox.sources`).

## 1.89.1 — environments are listed by their latest activity

The viewer lists environments newest activity first: the latest journal event there — a
message, a to-do, a question, work — or a live session's last hook event, whichever is newer.
An environment where something just happened moves to the top. The overview carries each
environment's `last_active`.

## 1.89.0 — the sidebar shows what the agent is doing

The bottom of the viewer's sidebar is an Activity section for the environment you are on: the
latest message of the agent working it, when a session is live there, and the latest journal
events — work started, noted and ended, to-dos added and closed, questions asked and answered,
messages left and processed — newest first, refreshed with the rest of the page. It is served by
`ActivityController` (`GET /api/env/<env>/activity`). Messages no longer hide processed ones behind
a switch, and the to-do icon is a ring with a check, like the status rings.

## 1.88.0 — a question can explain itself and offer choices

A question is one short line, and can carry a description — the context the user needs to
decide — and options: `journal questions add "<question>" --description="…" --option="…"
--option="…"` (and the same on `questions edit`, where only what is given changes). In the
viewer the description is shown under the question and each option is a button that answers
with it; the box below still takes an answer of the user's own. The skill says to write
questions this way.

## 1.87.3 — Project docs and Environment docs

The viewer's "All docs" only ever listed the project's own docs, so it is called Project docs;
an environment's docs page, its sidebar item and its Home count say Environment docs.

## 1.87.2 — the viewer no longer marks the terminal's current environment

Which environment the terminal starts on matters to commands, not to a browser that picks its
environment from the address. The sidebar no longer highlights it; environments with a live
session are listed first and marked as live, and the viewer opens on one of them — the start
environment only when no session is working anywhere.

## 1.87.1 — list switches are remembered, and group sort controls sit flush

Each list's show/hide switch is remembered in the browser, per list; on Messages, Show
processed starts on. The sort control in a group's header is plain text with a chevron, with
no box around it.

## 1.87.0 — one list, one switch, everywhere in the viewer

Every list in the viewer is the same component: to-dos, pins, rules, messages, questions,
work, reminders, docs, tools and the lists on Home. Each groups its rows by status under
dividers, sorts each group on its own (number, or priority for to-dos, in either direction —
number first, newest on top), shows the first 25 with Show more, and hides what is closed
behind one switch in its bar — Show done, Show struck, Show processed, Show answered, Show
ended, Show retired, Show superseded. Rows have the same columns and the same spacing
everywhere. Single on/off settings use one switch component, label on the left and the
switch at the end of the row: the list bars, Search's Every environment and Settings' auto
mode. A list that is empty only because its closed rows are hidden says so.

## 1.86.1 — list bars show only their counts

The bar under each page title says only how many there are — "27 open", "18 standing" — and
no longer "Grouped by status", "Ordered by newest", "Said again at every stop" and the like.

## 1.86.0 — the viewer keeps itself current

Every list and item on screen refreshes itself every five seconds while the tab is visible,
one request at a time, and a failed refresh is simply tried again on the next tick (search
does not poll). The overview carries the version being served; when it changes — after an
upgrade — an open page reloads itself so the new viewer renders.

## 1.85.0 — Home opens what you click beside the page

Clicking a to-do, a message or a question on an environment's Home opens it in a side panel
next to Home, instead of leaving the page; the panel has an Open page button that goes to the
resource's own page, and the row stays marked while it is open.

## 1.84.0 — the skill knows the viewer; Home's to-do table switches to Recently finished

The journal skill and its command reference catch up with this branch: Messages (and editing
or moving one), new answers to a question and rewording one, the web viewer (`journal serve`)
and what the user does there — and that the record can therefore change under a running
agent, so it re-reads before acting — the viewer's Search, tools' required title and summary,
and removing an environment. On Home, Recently finished is no longer its own table: the to-do
table switches between Open and Recently finished.

## 1.83.1 — the viewer stops refetching forever, and the server reads the environment list safely

Every list in the viewer refetched its data the moment the last fetch landed, over and over,
because the fetch effect read the data it was about to replace: about 23,000 requests in a
quarter of an hour, which is why the viewer felt slower. It now fetches when its address
changes or a write asks it to. The Search button is enabled as soon as there is a term (an
empty string counted as disabled), and it shows a spinner only while a search runs. The server
reads the environment list from a copy, so removing an environment while another request lists
them no longer crashes that request. Open work rows no longer show a status dot.

## 1.83.0 — search finds the conversation on an environment again

Searching one environment's conversation found nothing said in any recent session. The
transcript was split by environment by matching the session-start notice's wording, and when
that wording changed ("you are on environment" became "this session is bound to environment")
nothing matched, so every session counted as `default`. The journal now RECORDS the line each
environment begins at — at every session start and every switch (`session_marks` in the
record) — and search splits a transcript by that record. The old text match is kept only for
sessions older than the record, and knows both wordings. The viewer's Search page shows a
spinner and disables its button while it searches, and the open-work status ring lines up
with its text.

## 1.82.0 — tools have a page, and always a title and a summary

The viewer's Project group has Tools: every catalogued script with its title, summary, usage,
when to use it and its entry point, and New tool, Edit and Retire. `journal tools` list, show,
add, set, remove and index run through a new `ToolsController` (`GET/POST /api/tools`,
`GET/PATCH/DELETE /api/tools/<n>`), which names a tool by its number or its name. A tool was
already refused without a title and a summary when added; now neither can be blanked with
`tools set` either, because they are what every session is handed. Also: Home's Recently
finished shows only each to-do's number, title and when, and status dots are hollow rings.

## 1.81.0 — Home shows what was recently finished

An environment's Home lists the last eight finished to-dos beside the open ones, newest
first, each with how it ended and when, linked to its page. A to-do row now carries `how`
and `done_age`.

## 1.80.0 — auto mode is its own command

Auto mode belongs to an environment, not to its to-do list, so it has its own command:
`journal auto-mode` says whether it is on, `journal auto-mode enable` and `journal auto-mode
disable` switch it (`auto on|off` answer too). `journal todos auto on|off` still works. The
stop and session-start notices, the loop refusal, the skill, help and the README all name
the new command, and the switch runs through the environment's controller — the same one
behind the viewer's Settings page.

## 1.79.0 — search from the viewer

Each environment's sidebar has Search, under Home. It searches like `journal search` — every
line said in the sessions on that environment, or on every environment, newest first, paged,
with the matched words marked — and also the journal's own to-dos, pins, rules, questions,
messages, reminders and docs, each linked to its page. `journal search` and the viewer both
run through `SearchController` (`GET /api/env/<env>/search?term=…&all=&page=`), and the
stretch of text around a match is built once, in `transcript.snippet`.

## 1.78.0 — the inbox is called Messages

What the user leaves for the agent read, from the user's side, like mail addressed to them.
It is now Messages everywhere a person or an agent reads it: `journal messages` (with
`message` and the old `inbox` still answering), the stop notice "the user left N message(s)
for you", help, the skill, and the viewer's sidebar, pages and Home (`#/env/<env>/messages`;
old `/inbox` links still open). The store and the API keep their internal name.

## 1.77.3 — New buttons sit in the top bar

Every button that creates a resource (New to-do, New pin, New rule, New reminder, Start work,
New doc) is in the page's top bar, beside the breadcrumb, and the bar below keeps only what
describes the list: the Show done switch is back on the right.

## 1.77.2 — statuses are small coloured dots

Every status in the viewer is a filled dot: blue in progress, amber blocked, green done,
violet waiting on the user, grey open, dim grey withdrawn.

## 1.77.1 — the viewer is never served from the browser's cache

Every response from `journal serve` says `Cache-Control: no-cache`, so after an upgrade the
browser loads the new viewer instead of the copy it kept of the old one. The auto mode switch
on the Settings page sits on the left.

## 1.77.0 — an environment has a Settings page

The viewer's environment sidebar ends with Settings: a switch for auto mode, and removing the
environment, which asks for its name to be typed first and says what will be deleted. The
start environment cannot be removed, and neither can one a live session is on. Both go
through a new `EnvironmentController` (`GET /api/env/<env>/environment`, `POST …/environment/settings`,
`POST …/environment/remove`), and `journal environments remove <name> --yes` runs through it
too.

## 1.76.0 — the viewer can create, edit, move and close every resource

Every list in the viewer has a New button (to-dos, pins, rules, reminders, work, docs; the
inbox keeps its message box, and questions are only asked by the agent), and every detail
has the actions its resource takes, each opening a small form:
- to-do: Edit (title, brief, priority), Mark done, Waits on, Move, Drop — and Reopen once closed;
- pin: Edit, Move, Promote to rule, Strike; rule: Edit, Strike;
- question: Edit, Withdraw (and the answer box as before); inbox message: Edit, Move;
- reminder: Edit, Move, Retire; work: Add note, End work; doc: Edit (abstract, status), Add part, Move.
Reminders and work get their own detail panels. A closed or struck resource shows no edit
actions, because the server refuses them. All of it goes through the same controllers the
terminal uses.

## 1.75.1 — `todos auto`, `prune` and `from-commit` go through the controller

The last three `journal todos` commands that still read and wrote the store themselves run
through `TodosController` as its `auto`, `prune` and `commit` actions, and print only what
they return. No command a user types handles a resource on its own any more.

## 1.75.0 — every controller action takes its own typed payload

A controller declares the payload each action takes (`payloads/`): shared ones where the
fields are the same — `WhyPayload` for strike, drop, withdraw and retire, `MovePayload` for
every move, `ListingPayload` for every list, `TextPayload`, `AnswerPayload`, `SectionPayload`
— and a resource's own where they are not, namespaced by resource (`payloads.docs.AttachPayload`,
`DetachPayload`, `FilesPayload`, `payloads.todos.StorePayload`, …). Each field has a type, a
default and the key it is sent under, and a value that does not fit its type is refused
before the action runs. A parsed CLI command and an HTTP request both build the payload
through `controller.dispatch`, the one way into a controller; actions read typed attributes
instead of looking fields up by name.

## 1.74.0 — docs go through their controller

Every `journal docs` command runs through `DocsController` and prints only what it returns. A
doc is addressed by number, by part (`4.2`) or by title, the same from the terminal and the
web. The viewer's API serves `GET/POST /api/docs` (the project's own docs) and
`/api/env/<env>/docs` (an environment's), `GET/PATCH/DELETE /api/docs/<n>[.<p>]` (PATCH takes
an abstract, a status or a body; DELETE strikes a part), and `POST …/<n>/part|final|draft|move|supersede|detach`
and `POST /api/docs/search`. Attaching copies a file from this machine, so it is refused from
the browser. A doc's terminal page and the viewer's detail are built from the same data.

## 1.73.0 — work goes through its controller

`journal work start|update|await|end` and `journal open` run through `WorkController` and print
only what it returns; ending work with `--todo`, and the reminder that a to-do of that title
stays open, are decided there. The viewer's API serves `GET/POST /api/env/<env>/work`,
`GET/PATCH/DELETE …/work/<n>` (PATCH files a note, DELETE ends it), and
`POST …/work/note|end|wait` by the work's words. Ended work refuses every change.

## 1.72.1 — help and the skill teach inbox edit and move

`journal help` lists `inbox edit` and `inbox move`, and the skill names `inbox move` for a
message left on the wrong environment. The skill's stop order now reads questions before
work, as the queue has run since 1.69.2.

## 1.72.0 — the inbox goes through its controller; a message can be reworded or moved

Every `journal inbox` command and the viewer's inbox API run through `InboxController`:
`GET/POST /api/env/<env>/inbox`, `GET/PATCH …/inbox/<n>`, and `POST …/inbox/<n>/process|done|move`.
`journal inbox edit <n> "<text>"` rewords a waiting message, and `journal inbox move <n>
"<environment>"` carries one left on the wrong environment to the right one: it is closed
here as moved and waits there. A processed or moved message refuses every change, and a
message is never deleted (DELETE is 405). A method a resource does not take is now 405.

## 1.71.0 — pins and rules go through their controllers

Every `journal pins` and `journal rules` command runs through `PinsController` and
`RulesController`, and prints only what they return. The viewer's API serves
`GET/POST /api/env/<env>/pins`, `GET/PATCH/DELETE …/pins/<n>`, `POST …/pins/<n>/move|promote|amend`,
and the project-wide `GET/POST /api/rules`, `GET/PATCH/DELETE /api/rules/<n>`,
`POST /api/rules/<n>/amend`. Changing a claim's fact strikes the old one and adds the new one
under a new number; its reasoning is changed in place. A struck pin or rule refuses every
change. The router now serves project-wide resources at `/api/<resource>` as well as
environment ones at `/api/env/<env>/<resource>`.

## 1.70.2 — question pages and the reminders list print only what their controllers return

`journal questions show <n>` prints the question from its controller's row, and `journal
reminders` takes the environment name and the reminder interval from the controller's
result instead of reading them itself.

## 1.70.1 — `journal todos` prints only what its controller returns

The to-do list and a to-do's page in the terminal are printed from the controller's result,
the same data the viewer gets as JSON, instead of reading the store a second time. A to-do
row now carries its terminal facts line (`meta`) and whether it started or is done; the
detail carries the facts line under the title and the file it lives in. The terminal list
still orders by priority, highest first; `--order-by-id` and `?sort=` order by anything
else.

## 1.70.0 — resources are typed, and read through repositories

Every resource has a typed model — `Todo`, `Claim` (a pin) and `Rule`, `Reminder`, `Question`,
`Message` (the inbox), `Work`, `Doc` with its `Part`s and `Attachment`s — and a repository
that reads it: `Todos(root, env).all()`, `.find(n)`, `.query().where(...).order_by("priority",
"desc").page(cap, page)`. A doc's parts and attachments are repositories of their own
(`Docs(root).parts(n)`). The to-dos, questions and reminders controllers read through them.
Any list can be sorted by any field its model marks sortable, in either direction: the API
takes `?sort=<field>&direction=asc|desc`, and a field that cannot be sorted on is refused with
the list of those that can. Writes still go through each store's own functions.

## 1.69.2 — an answered question always reaches the agent

A question linked to a to-do was never told when that to-do was the open work. It was left
to the to-do's own "the user answered" notice, which only runs when nothing is open. Now
every answered question is told at the next stop. With nothing open, the to-do's notice
still tells it, beside the to-do, and marks it told so it is not said twice. Answered
questions also come before "work still open" in the stop queue: that notice fires every
time work is open, so it used to take the stop and the answer never got its turn.

## 1.69.1 — plain wording for a new answer

Answering a question that already has an answer adds a new answer; the old one stays in its
history. The viewer now says so plainly: the box reads "Write a new answer. The old one stays
in the history." and the button "Add new answer". The agent is told "(a new answer)".

## 1.69.0 — to-dos go through their controller; a closed to-do cannot be edited

Every `journal todos` command and the viewer's to-do API run through `TodosController`:
`GET/POST /api/env/<env>/todos`, `GET/PATCH/DELETE …/todos/<n>` (PATCH takes `title`, `body`
and `priority`; DELETE drops it and wants a `why`), and `POST …/todos/<n>/<action>` for
done, reopen, start, move, ask, answer, block, unblock, after, report, priority, amend and
replace. A closed to-do — done or dropped — refuses every change, from the terminal and the
web alike, and names `reopen` as the way back.

## 1.68.0 — questions go through their controller; an answer can be edited

Every `journal questions` command and the viewer's question API run through
`QuestionsController`. `journal questions edit <n> "<question>"` rewords a question.
Answering an answered question edits the answer: the earlier one is kept, and the agent is
told at its next stop, marked "(the answer changed)"; rewording an answered question tells
it again too. The viewer's button reads "Edit answer".

## 1.67.0 — resources go through controllers; reminders first

A resource is served by one controller — `index`, `show`, `store`, `update`, `destroy` and
its own actions — that takes a payload and returns a result. The terminal and the web both
reach it the same way: a parsed CLI command and an HTTP request each produce the payload
(`controller.PayloadSource`), the controller does the work, and the command renders the
result as text while the server sends it as JSON. Reminders are the first resource on it:
every `journal reminders` command runs through `RemindersController`, and the viewer's API
serves `GET/POST /api/env/<env>/reminders`, `GET/PATCH/DELETE …/reminders/<n>` and
`POST …/reminders/<n>/move`. Destroying a reminder retires it with a reason; nothing is
erased. The other resources follow.

## 1.66.1 — the sidebar is titled with the selected environment

The name at the top of the viewer's sidebar is the environment you are looking at, with its
initial as the mark, and it links to that environment's Home; the project's name shows on
hover. The environment's name no longer repeats as a label above its pages.

## 1.66.0 — an environment has a home page

Opening an environment in `journal serve` lands on its Home, reached from a Home item at
the top of the sidebar. Home is the quick overview: counts for the inbox, open questions,
to-dos, pins, reminders and docs, each linking to its page; the open work with its latest
notes; waiting inbox messages and open questions; and the to-dos in progress, waiting on the
user and blocked, with the top five open by priority. Open work has no sidebar entry of its
own any more — it lives on Home.

## 1.65.0 — the web viewer takes the approved dark design

`journal serve` is restyled to the approved console design: a dark sidebar with this
environment's inbox, to-dos, questions, pins, open work, reminders and docs, each with its
count, the project's rules and docs, and every environment; a breadcrumb bar; and lists in
fixed columns. To-dos are grouped by status and ordered by priority, with a chevron for
priority and a pill for status in their own columns rather than badges before the title.
Selecting a to-do, pin, rule, message or question opens it in a panel beside the list; a
doc opens as its own page. The routes and the JSON API are unchanged; a to-do row now
carries its priority and the overview names the project.

## 1.64.2 — reading environments is a read; assigning a to-do is a write

`journal environments`, `journal environments "<name>"` and `journal grants` only list, and
are no longer classified as writes: they are not held behind open work, a lent subagent may
run them, and a session on no environment is no longer refused the listing its start block
tells it to read. `journal assign <n>` holds a row for an agent, so it is now a write and is
gated like one. Switching, claiming, preparing, removing and granting are unchanged.

## 1.64.1 — a pin's reasoning moves to the environment its pin is on

An older `pins.body_dir` filed a pin's reasoning under the project's start environment
rather than the session's, so the pin listed on one environment and its reasoning file sat
in another's folder. The writer was fixed earlier; this migration moves each misplaced file
to the environment whose pins name it, and leaves a file alone when more than one
environment names it or a copy is already in place. It runs on the next command.

## 1.64.0 — the web viewer writes: an inbox box and question answers

`journal serve` has an Inbox page per environment with a message box — what is sent lands in
that environment's inbox, marked as from the browser — and each message shows what its parts
became, linked. A Questions page lists the environment's questions; a question's page shows
what it is about, linked, and an answer box. The to-do, pin, rule and doc pages list the
questions about them; a rule's and a doc's carry the environment each was asked on. These are
the viewer's first writes: POST with a JSON body, refused from another origin.

## 1.63.2 — the skill teaches the inbox, and that asking through the journal is always allowed

The `journal` skill has two new sections: how to process an inbox message — split it into
parts, route each by the chat rules, a question for any part not understood, record, then
`inbox done` — and how to ask the user through `journal questions add`, which never halts
the session and can be about any resource. "Ask in two cases" is now "stop on a to-do in two
cases": it is about when to stop, not whether a question may be filed. The hold table names
the inbox holds, and with auto on the refused question tool now points at `questions add`.
`references/commands.md` lists the inbox and questions verbs.

## 1.63.1 — the inbox is announced

A stop holds while the active environment has unprocessed messages — subject `inbox`,
priority 7, just after `claimed` and `environment` — naming how many and how to process
them. Between stops, the first tool call after a new message mentions it once, as context,
and never blocks; each message is announced once per session and environment. `silenced:
["inbox"]` turns both off.

## 1.63.0 — the inbox: messages the user leaves for the agent

`journal inbox "<message>"` leaves a message on the active environment: an instruction, a
follow-up, anything. The agent splits each one into parts with `journal inbox process <n>
--part="<words>" --became=<ref>` — a to-do, pin, rule, reminder, question, `work` or `noted`
— and `journal inbox done <n>` marks it processed once its parts say what they became. A part
must quote the message and what it became must exist, so a record cannot be invented. A part
the agent does not understand becomes a question: `questions add --about="inbox <n>"` links
it. Nothing is ever deleted. `journal inbox` lists waiting messages first; `inbox show <n>`
reads one with its parts and questions. The stop nudge and the web viewer's inbox follow.

## 1.62.20 — the rest of the package says what it says from templates

The installer's lines, the parser's refusals, entry retire and move replies, settings
complaints, worktree notes, the context warning, the digest, the web viewer's errors, the
trimming lines in `fmt`, the shipped rules and the command modules' value refusals are
declared once in their module's table and filled by `render`. What is left as an f-string
is data: file names, stored references, URLs and padding. The wording is unchanged.

## 1.62.19 — grants, agents, verify, update and migrate say what they say from templates

The subagent refusals and briefings, the `verify` rows, the upgrade notice and changelog
replay, and the migration report are declared once per module in `MESSAGES` and filled by
`say`. The wording is unchanged.

## 1.62.18 — the hook says what it says from templates

Every hold, denial, hint and start-block sentence `hook.py` produces is declared once in its
`MESSAGES` and filled by `say`; `_say` still shapes a hold into its fact and what to do about
it. The wording is unchanged.

## 1.62.17 — environments and cleanup say what they say from templates

Every message `tracks.py` and `cleanup.py` return or print — claim, switch and remove
replies, an environment's pick-up page, the findings report and the reading pass — is
declared once in `MESSAGES` and filled by `say`. The wording is unchanged.

## 1.62.16 — to-dos say what they say from templates

Every message `todo.py` returns or prints — refusals, confirmations, a row's state line,
the listing, a to-do's page, commit-trailer replies and the carry block — is declared once
in `MESSAGES` and filled by `say`. The wording is unchanged, except that a close with no
recorded reason no longer prints the word `None`.

## 1.62.15 — docs says what it says from templates

Every message `docs.py` returns or prints — refusals, confirmations, the catalogue, a doc's
page, citation labels, the carry block — is declared once in `MESSAGES` and filled by `say`.
The wording is unchanged.

## 1.62.14 — tools and pins say what they say from templates

Every message `tools.py` and `pins.py` return or print is declared once in the module's
`MESSAGES` and filled by `say`, the shape `reminders.py` already had: a refusal, a
confirmation, the catalogue, a claim's facts, the carry block. The wording is unchanged.

## 1.62.13 — the status page is a command class

What bare `journal` shows is declared in `commands/status.py`, its text from templates, and
answers `journal status` too. Bare `journal` hands its options to it, so an unknown option is
refused by the same parser as every other command. `journal.py` is now the entry point alone:
environment set-up, help, and the hand-off to the registry.

## 1.62.12 — the system verbs move onto command classes

`cleanup`, `migrate`, `loop`, `update`, `upgrade`, `verify`, `settings`, `serve`, `enable`,
`disable` and `version` are declared in `commands/system.py`, their text from templates.
`journal.py` keeps no flag table and no command table of its own; the hook's last verb list
(`JOURNAL_WRITES`) is gone, so every write is classified by the registry. Two edges change:
`tidy` and `migrations` now count as writes like the spellings they alias, and `journal loop
<anything else>` is refused instead of reading as bare `journal loop`.

## 1.62.11 — the transcript verbs move onto command classes

`conversation`, `user`, `search` and `carry` are declared in `commands/transcript.py`, their
text from templates. Bare `journal --back=N` still reads the conversation, by handing the
command line to `conversation`. What each accepts and prints is unchanged.

## 1.62.10 — the environment and session verbs move onto command classes

`switch`, `claim`, `prepare`, `grant`, `grants`, `lent`, `assign`, `worktree` and the
`environments` noun (with `environment`, `envs`, `env`, `tracks`, `track`) are declared in
`commands/environments.py`. `environments switch|claim|prepare` are real subcommands now
rather than a rewrite of the command line in `journal.main`. Every one keeps the write
classification it had, including two worth deciding about (to-do 31).

## 1.62.9 — `tools` moves onto command classes; the hook's noun tables are gone

`journal tools` is declared in `commands/tools.py`, and with it the last per-noun write table
in `hook.py` (`NOUN_WRITES`) is removed: every declared noun is classified from its command
classes, one place. `journal tools run` still hands its arguments to the script untouched.
The `--summary`/`--usage`/`--when`/`--entry` options are declared on `tools add` instead of
being special-cased by the CLI's flag loop.

## 1.62.8 — `docs` moves onto command classes

Every docs verb — list, show/read, `<doc> files`, files, add, part, replace, strike, final,
draft, abstract, move, supersede, attach, detach, index and search — is declared in
`commands/docs.py`, and the hook classifies docs writes from those declarations instead of
its own table. What each accepts and prints is unchanged.

## 1.62.7 — `todos` moves onto command classes

Every to-do verb — list, show, add, start, done, drop/strike, reopen, move, ask, answer,
block/skip, unblock, after/needs, report, priority, amend, replace, auto, prune and
from-commit — is declared in `commands/todos.py`, and the hook classifies its writes from
those declarations instead of its own to-do tables. A bare number is no longer filed as a
to-do title: `journal todo 42` shows to-do 42.

## 1.62.6 — `work`, `start`, `end`, `open` and `next` move onto command classes

The work commands are declared in `commands/work.py` and their messages, and `work.py`'s,
come from templates. What they accept and print is unchanged.

## 1.62.5 — `pins` and `rules` move onto command classes

`pins`, `rules` and their bare spellings — `pin`, `rule`, `rule --strike N`, `strike`,
`promote`, `nothing` — are declared in `commands/pins.py` and classified by the hook from
those declarations. The `remember` alias is gone: `journal pin` is the spelling. `journal pins 3` and `journal rules 3` now show that claim
(as `show` does) instead of printing the whole list; `--full` still opens the conversation
around it. The `--brief`, provenance and doc-citation helpers every command uses moved into
`app.py`.

## 1.62.4 — commands are declared by signature

A command class declares itself with one signature string, Laravel-style:
`signature = "questions:answer {n : a question number} {answer* : the answer}"`. `{x}` is a
required argument, `{x?}` optional, `{x*}` takes the rest of the words; `{--flag}` is a bare
flag, `{--opt=}` takes a value, `{--opt=1}` has a default, `{--opt=*}` repeats; ` : ` gives the
description a refusal uses. Types and validation come from a `casts` dict. A command can also
`need` an option to be present before it is chosen, which is how `rule --strike N` will keep
working. `questions`, `ideas` and `reminders` are declared this way; nothing they accept or
print changed.

## 1.62.3 — `reminders` moves onto command classes

`journal reminders` (and `reminder`, `remind`) now runs from `commands/reminders.py`, its
messages from templates, and the hook classifies its writes from those command classes. What
it accepts and prints is unchanged. A lent subagent is now refused `journal remind` writes too:
`reminders` and `reminder` always were, and the third spelling of the same write never was.

## 1.62.2 — commands are classes, one file per noun; `ideas` moves over

A command is now a `Command` subclass (`command.py`) that declares its noun, verb, arguments,
options and whether it writes, and carries its own `run()`. Each noun's commands live in their
own file under `commands/` (`commands/questions.py`, `commands/ideas.py`), registered in
`commands/__init__.py`. The helpers every command shares — the root, the session, the clock,
refusals, the catalogue page — moved out of `journal.py` into `app.py`, which the entry script
starts with its own path so a worktree's symlinked `.journal` still resolves as the worktree.
`journal.py` loses what moved; the remaining nouns follow the same way.

`journal ideas add` is now recognised as a write by the hook — it never was, so an idea
could be filed with no work open and by a subagent. `journal idea "<text>"` files an idea,
as the help always said it did (the old handler refused it); a bare number is still refused
rather than filed as an idea. The promote refusal names `--title=`, the flag it takes, instead
of `--todo=`.

## 1.62.1 — commands declared once; `questions` is the first noun on them

`commands.py` declares each command — its noun, verb, arguments, options, and whether it
writes — and `cli.py` parses a command line into an object handlers read by name, with every
refusal (a missing argument, a word that is not a number, an unknown option or verb) built
from the declaration. The hook decides whether a declared command writes from that same
declaration instead of a table of its own. Output messages are templates with named
placeholders (`templates.py`). `questions` is the first noun moved over; the rest follow
one at a time. Nothing changes in what any command accepts or prints, except that an option
a command does not declare is now refused for that command rather than silently ignored.

## 1.62.0 — questions are a resource of their own

`journal questions add "<question>" --about=todo 22 --about=doc 4.1` files a numbered
question on this environment, linked to any number of resources — to-dos, docs and doc
parts, pins, rules — and a resource can carry any number of questions. `questions answer
N "<answer>"` answers one; the agent is told at its next stop, once, and the question
remembers it was told so no later session hears it again. `questions link`/`unlink` change
what a question is about, `questions withdraw N "<why>"` retires one that no longer needs an
answer, and `journal questions` lists open ones first.

`todos ask <n> "<question>"` now files a question linked to the to-do instead of writing it
into the to-do's file, and `todos answer <n>` answers it; a to-do with several open questions
asks you to answer each by its question number. A to-do waits on the user while any linked
question is open. Existing questions and answers stored on to-dos are moved into questions
the first time 1.62.0 runs. An answered to-do question is announced with its to-do, as before,
and not a second time on its own.

## 1.61.6 — `journal serve`: a browser over the journal

`journal serve [--port=<n>] [--open]` starts a local, read-only web viewer — every
environment's to-dos, pins, open work and reminders, plus the project's docs and rules,
browsable instead of typed. Stdlib only (`http.server`, bound to 127.0.0.1): the server
answers a thin JSON API (`serve.py`, built on a new `views.py` read layer), and a small
Vue 3 app (loaded from a CDN, no build step) renders it in the browser. Read-only in this
release — writing from the browser needs an attribution story the CLI already has and a
web click does not, and stays a later decision.

## 1.61.5 — a to-do's `.md` file is written atomically now

`todo._write` used to `path.write_text(...)` in place — open-with-truncate, then write —
with a window in between where a row started and then closed moments later (`todos
start` followed by a commit trailer's close, exactly the shape a hook produces) could be
read by a concurrent reader (a background loop's `journal next`, a second hook) as empty
or with an unclosed front matter, which `_read_todo` treats as no front matter parsed at
all. Reported live: `journal todos` showed an already-DONE row (confirmed done by
`journal todos <n>`) as merely "started ... but the work was ended without closing this
row". Demonstrated with a hammering-thread test — 2,672 torn reads in 2 seconds of the
old code, 0 after the fix. `_write` now writes its own tmp file and `os.replace`s it in,
the same pattern `state._write` already uses for exactly this reason.

## 1.61.4 — the to-do listing stopped claiming "work is open" for a row that isn't

Same shape of bug as 1.61.3, different code path: `journal todos` said "started N ago,
work is open" for ANY row with a `started` stamp, never checking whether work was
actually still open for it. Since a plain `work end` (no `--todo`) never clears
`started`, a row that was started and then ended without closing the row kept claiming
open work forever after. Found live, in this project's own dogfood instance, right
after fixing 1.61.3 — `journal todos` said to-do 6's work was open while `journal open`
correctly said nothing was. Now checks `work.open_work()` for a matching subject and
says so honestly either way.

## 1.61.3 — the stall nudge names the row actually open, not the last one `started`

"N tool calls on to-do X with no progress filed" could name the wrong to-do: a row's
`started` stamp is never cleared by a plain `work end` (only `--todo`/`done` clears the
row), so a row that was started, ended, and then touched again (`todos after`, `todos
block`) still carried `started` and could sort after the row genuinely open. The nudge
now matches the started to-dos against `work.open_work()`'s subject instead of just
taking the last row with a `started` timestamp. Found by a peer session: the nudge named
to-do 2269 (ended, then chained onto another to-do) while the real open work, per
`journal open`, was to-do 1417.

## 1.61.2 — a commit trailer can close several to-dos on one line

`Journal: todos done 2263 2264` used to close 2263 and silently read "2264" as part of
2263's `how` text — the second number vanished with no sign anything was swallowed. A
run of bare numbers right after the first is now read as more refs, all sharing the same
environment and `how` text as the first. Found by a peer session that had to close the
second one by hand after the trailer's reply said only "closed what it named: done
2263". `<environment>/N` still only applies to the first number in the run — a bulk
close on one line means "these, in the environment I already named."

## 1.61.1 — `journal next` stopped calling a non-empty list empty

With auto on and nothing ready, `journal next` checked only whether a to-do was waiting
on the user's answer — if none was, it said "The list is empty. Stop the loop if one is
running." even when every remaining row was set aside on a condition, waiting on a
prerequisite, or held by a live agent. `hook.py`'s idle-stop advisory already named all
four reasons correctly; `journal next` predates the set-aside feature and was never
updated to match. It now reports every reason a row can't be picked up, the same way the
stop hook does, instead of only "asking" or "empty".

## 1.61.0 — `journal todos prune`: clear old done to-dos off the list

`journal todos prune --older-than=30d` (or `--before=<date>`) moves every done or
dropped to-do older than that under `todo/<env>/archived/` — invisible to the normal
list from then on, but never deleted; `--force` actually deletes instead. An open to-do
is never touched, whatever its age, and there is no silent default: an age or date is
required every time. Found the need for this in a project whose default environment had
2163 to-do files on disk with only 47 still open — nothing ever pruned a finished one
before.

## 1.60.0 — a to-do has a priority now

`journal todos priority <n> <value>` sets it — a raw number or a name (`low`=50,
`default`/unset=100, `high`=150, `critical`=200). Bigger is more important. `journal
todos` now lists highest priority first by default (`--order=asc` for lowest first,
`--order-by-id` for the old plain-number order), and `ready()` — what `journal next` and
auto mode pick up next — sorts by it too, so the most important ready to-do is always
suggested first. An answered to-do still comes before an unanswered one regardless of
priority: the user replying to a question is their own word to do it now. Existing
to-dos with no priority set behave exactly as priority 100 — nothing to migrate.

## 1.59.3 — `journal next` stays honest while disabled

`journal disable` only reaches the hook layer — it cannot see or stop a session's own
scheduled `/loop` wakeup, so a loop firing `journal next` every few minutes kept running
its full hold/to-do advisory logic regardless, which can read as actively contradictory
right after the journal was silenced. `journal next` now checks first and prints one
line — "hooks are disabled. `journal enable` turns them back on." — instead.

## 1.59.2 — `journal enable` / `journal disable`, not `enable true|false`

Same kill switch as 1.59.0, split into two plain verbs instead of one taking an
argument: `journal disable` turns every hook inert, `journal enable` turns it back on.
Bare `journal` now shows DISABLED on its own status line when it is off, instead of a
separate status subcommand.

## 1.59.1 — a rule's reasoning survived an upgrade for the first time

`install.py`'s `DATA` exclusion list — what a pull never touches — was missing `rules`.
docs/tools/environments/todo were already protected as project data; a rule's long-form
reasoning (written by `pins.write_body` under `.journal/rules/`) was not, so upgrading
deleted every rule's body that existed before the pull. Caught by running the upgrade
against this project itself, which lost two rules' reasoning before the fix landed (a
third was recovered). If you have rules with a written-out `--brief`, upgrading to
1.59.1 is what stops losing them; nothing before this fixes what already happened.

## 1.59.0 — `journal enable`: a kill switch for the hooks

`journal enable false` makes every hook event inert — no hold, no gate, no context, no
write filed — until `journal enable true`. Bare `journal enable` reports which. The CLI
itself is never gated by it either way; only the hook goes quiet. This is the user's
switch, never an agent's: run `enable false` only because the user explicitly asked for
it, by name — never to get past a hold, a gate or a refusal.

## 1.58.3 — asking a to-do again retires the old answer

`todos ask` set the question and cleared `started`, but left the previous `answer`
standing — so a re-asked row read as answered: the hold announced a reply nobody had
given and `show` printed the new question above the old answer. A new question now
clears the answer; the exchange stays in the row's history.

## 1.58.2 — an answered to-do still waits for the rows it was sequenced after

The user's answer is their word to do a to-do — but a row given `after 1717,1704` waits
on those landing, and the answer does not close them. The hold said "the user answered
to-do 1410: start it" while both prerequisites were open. `answered` now skips a row
whose prerequisites are unmet, as `ready` already did; the answer counts the moment the
last one lands.

## 1.58.1 — the suites do not ship to consumers

A pull and a fresh install copied `test_*.py` and `testkit.py` into every consumer's
`.journal/`. They are tested where the package is developed; in a consumer they are a red
suite an agent finds and starts fixing — the tool, instead of its own work.

`install --from` and `journal upgrade` now leave them out, and remove the ones an earlier
pull left behind, saying so by name. `install.sh` skips them on a fresh clone. The
development checkout — the one that is a git repository — keeps its suites.

## 1.58.0 — with auto on, a question to the user is refused

Auto says the list drains while the user is away. `AskUserQuestion` halts the session
until they are back — which the skill already said not to do, and a skill is advice read
once. Measured: the agent asked, the list sat there.

Now the PreToolUse gate refuses `AskUserQuestion` while `todos auto` is on for the
session's environment, naming the two ways out: decide it and file the choice with `work
update`, or `todos ask <n>` so the row waits on the user and the list moves on. Reads,
the journal's own CLI, and every other tool are untouched; with auto off nothing changes.

## 1.52.0 — the docs 1.44.0 silently scoped, and a finding that can be done with

TWO OPEN QUESTIONS, ANSWERED. Both were parked for the user and both were handed back with
"answer them yourself, with a reason" — so the reasons are here rather than in a message
nobody will find again.

### A doc written before 1.44.0 carried provenance, not a scope

1.44.0 turned `track:` from provenance into scope and concluded the migration was nothing:
"a doc with no track at all is treated as global, which is what every doc written before this
release has." That is false for any version that filled the field in, and they all did. Both
docs in this project were invisible on three of its four environments; in another, 88 docs
existed while the default environment's catalogue counted 85.

THE CUT IS THE TIMESTAMP, NOT THE FIELD. Three repairs were possible. Make every tracked doc
global — correct for the old ones, but it un-scopes every doc somebody deliberately scoped
since. Leave them — keeps the harm. Or use `at:` against 1.44.0's own tag
(`2026-09-10T00:07:01Z`), which separates "the field was provenance" from "somebody chose
this scope" exactly. The third is taken, because its worst case is a pre-1.44.0 doc whose
track happened to be the right scope becoming visible everywhere instead of in one place —
over-visibility, undone by one `journal docs move`. The other two are wrong in the lossy
direction, and wrong-but-recoverable beats wrong-and-lossy.

It says which docs it moved, one line each. A migration that changes what a reader can see
and reports a number is the same defect one level up.

### `journal cleanup keep <finding>`

1.51.0 added a count of the rows the retired auto-close closed. Dogfooding it here produced
"21 row(s) were closed by a work-end matching their title" — all 21 audited, all genuinely
finished, and the line would have said 21 forever, because how a row closed is a fact about
the past and there was nothing to DO about it.

MOST FINDINGS ARE MISTAKES AND THIS ONE IS NOT. Everything else `cleanup` lists has a fix
beside it, and running the fix is how it stops being listed. So a countable finding now
carries a `mark`, and `journal cleanup keep <mark>` stamps it read — mirroring
`cleanup.stamp`/`last_read`, which already had this shape for the reading pass.

THE COUNT IS PART OF THE STAMP, so it is not a mute button: audit 21 and it goes quiet, and
it returns the moment there are 22. And it stamps rather than edits — the tempting fix is to
rewrite `how:` on those rows so the report stops matching them, which is editing the record
to satisfy a report about the record.

`cleanup_kept` also had to be added to `state.IN_RECORD`, and the omission announced itself:
the write fell through to per-session runtime and said "no transcript to file 'cleanup_kept'
under — mark not written" rather than failing silently.

## 1.51.0 — ending work is not finishing a row

`work end` closed any started to-do whose title matched the subject. In `workflows`, **710 of
1,810 closed rows — 39% — closed that way**, and not because anyone decided they were done.
Thirty-six were caught and reopened by an agent that noticed; the reopen reasons name the
mechanism in their own words:

    1197 · "it was closed by a work-end of the same name while I was filing, not by any
           implementation — nothing has been done to it"
    1258 · "parked on a Kit gap, not done — the work-end closed it"
    1725 · "closed by work end matching the title; the extraction is stashed and red"
    1847 · "the pre-check is answered, but mountedWhen(Matches) is not built -- ending the
           work declaration of the same name closed the row AGAIN"

The other 674 have never been looked at.

THE CAUSE WAS ONE MISSING DISTINCTION. `work end` meant two things and had one spelling:
"this is finished", and "I am putting this down". An agent interrupted by a new request does
the tidy thing — closes its declaration before switching — and the record heard the first
when the agent meant the second. A title match is evidence about NAMES and whether a row is
finished is a fact about WORK; no amount of matching gets from one to the other, which is why
the fix is a spelling for the distinction rather than a better heuristic.

CLOSING A TO-DO IS NOW ALWAYS EXPLICIT, and there are three ways, all deliberate:
`journal todos done <n> "<how>"`, a `Journal: todos done <n>` commit trailer, and
`journal work end "<subject>" --todo`, which is the one-command form. A bare `work end` that
matches a row REPORTS the match and leaves the row standing, naming both closes.

AND THE DEFAULT IS PARK, NOT SWITCH. The prompt nudge said "if this asks for something else
that CAN WAIT, park it" — which puts the call on the agent, and an agent gets that wrong in
the user's favour every time, because answering feels helpful. It now reads: a NEW request is
a to-do unless the user said to do it NOW, and *do not `work end` to make room*. The skill
says the same and adds why: the question is not "can this wait", it is "did they tell me to
do it now".

A SUBAGENT IS TOLD THE OPPOSITE, deliberately. `todos start` names `todos done` to whoever
started the row — except to an agent, whose one prohibition is closing a row. Offering it
that verb is how this package got caught teaching a subagent to mark its own homework once
already.

`journal cleanup` COUNTS THE OLD CLOSES. The retired path wrote "closed with the work of the
same name" and the new one writes "closed with the work that finished it", so the two eras
are separable in the store without a migration. Cleanup reports the count and the command
that reads them — one line, not 710 — and reopens nothing: most of them were probably
finished, and a sweep that changes what a reader sees without being asked is the defect, not
the fix.

## 1.50.0 — a search is a listing, and listings honour scope

`journal docs` has filtered by scope since 1.44.0. `journal docs search` did not: it read
every line of every doc in the project, so a doc deliberately absent from the catalogue
surfaced in the results anyway — with its LINES quoted, which is more than the catalogue
would have shown of it. Scope decides what is listed, and this is one of the places that
lists.

It now searches this environment's docs and the project's, says in its heading how many
matches are on other environments, and takes `--all` to reach them — the same shape
`journal docs` already had.

READING BY NUMBER IS STILL UNSCOPED, deliberately and unchanged. `journal docs 88` works
from any environment, because a rule binds every environment and may cite a doc: a reference
that stopped resolving outside one environment would make `--doc=N` a trap. What the search
declines to return is still something `journal docs <n>` will read.

## 1.49.1 — `*` is a scope, not an environment that went missing

`journal cleanup` flags a doc whose environment no longer exists. It found that by reading
`track:` as the name of an environment and asking whether one still goes by it — correct
while the field meant provenance, and wrong for every `--global` doc the moment it means
scope, because `*` is not an environment and never was one.

Found by dogfooding: doc 3 was this project's first global doc, and the next stop reported
it as belonging to a missing environment.

THIS IS THE THIRD THING TO READ `track:` WITHOUT KNOWING ITS MEANING HAD CHANGED. `cleanup`
started reading it while it was still provenance (which is what 1.44.0 cited as the reason to
make it a scope), 1.44.0's own migration assumed it was empty (to-do 66, still open), and now
this. A field that describes something always ends up deciding something — and the ones
deciding are never all in one place.

## 1.49.0 — a doc says which environment it belongs to

1.44.0 gave docs a scope and no way to see it. `journal docs` printed number, title, status,
parts, files, age and abstract — never the scope — so the one command whose job is to show
you the docs could not answer whether one was the project's or this environment's. The only
way to find out was `journal docs show <n>`, one doc at a time.

AND `show` SAID IT WRONG. It interpolated the raw field, so a global doc read "environment "
with nothing after it, or "environment *" — and a reader cannot tell "global" from "the
renderer said nothing", which is the same ambiguity an omitted section has. `docs.scope_text`
is the one funnel now, used by both: "the project's", or "environment <name>".

`journal docs --all` IS DOCUMENTED. It has worked since 1.44.0 and appeared in neither
`journal docs help` nor the README, so a reader who could not see a doc had no way to learn it
exists elsewhere. `journal docs move <n> "<environment>" | --global` is in the README for the
same reason, and it matters more now than it did: it is the repair tool for a doc whose scope
is wrong.

WHAT IS NOT CHANGING, and it is worth writing down because the natural assumption is the
opposite: a scoped doc does NOT live inside the environment's folder. Every doc is in one
project-wide directory and the scope is a field on it. A rule binds every environment and may
cite a doc, so a citation that stopped resolving outside one environment would make `--doc=N`
a trap — scope decides what is LISTED, never what can be read. And since 1.46.0 an
environment removal DELETES; docs in that folder would go with it, against the promise the
refusal already makes.

## 1.48.0 — a paragraph is one continuous thing, and a list is a list

Two screenshots, two renderers, the same root: text laid out for a width nobody was reading
at.

A BRIEF FRAYED INTO ORPHANS. A to-do's brief is written in an editor at whatever width its
author had. `block` printed every stored line as written — deliberately, so a list and a
command survive — so in a narrower terminal each line wrapped a SECOND time and left a one-
or two-word stub beneath it: "timezone", "clock time", "compares", "against.". Six orphans
in one brief, and it took a screenshot to see, because from inside the process the text
looked perfectly wrapped.

`fmt.prose` is the funnel for text a PERSON wrote: a paragraph is joined back into one
logical line and re-flowed once, and everything whose shape carries meaning is passed
through untouched — a fenced or four-space-indented code block, a list, a table, a heading,
a command. A quoted passage is the interesting case, and it is prose that happens to be
inset: the indent is kept and the words inside it flow.

`fmt.block` STAYS LINE-WISE, which is not an oversight. `render` and `say` hand it a page
that is already laid out, so joining adjacent lines there merges two column rows into one —
which is exactly what the first attempt did, across ten suites.

WIDTH WAS A CONSTANT AND A TERMINAL IS NOT. Every page asked for 88 columns whatever the
reader's window was. `fmt.room` resolves it once — the caller's width, or the terminal's,
whichever is smaller — and only when somebody is looking: a hook writes to the harness and a
test to a pipe, where the constant stands and the layout stays reproducible. A long heading
now drops its subtitle to its own line rather than off the edge.

NINE OPEN WORK SUBJECTS JOINED WITH "; " IS A PARAGRAPH, NOT A LIST. The second screenshot:
nine declarations run together, wrapped wherever each happened to end, with the instruction
buried at the far end. `_say` takes `rows` now and prints one per line, with air between the
list and what to do about it. The fact stays one line, because it is also the hold's label.

AND THE STOP LINES NO LONGER SAY `journal:` FIRST. The harness already labels them "Stop
hook feedback:" before a word of ours is printed, so it was the second label on the same
line. Asked for twice, and it survived both times because it is written in `hook.py` and
complained about on a screen.

## 1.47.0 — three things a field report saw that no check could

An agent working in another project wrote up what the journal did and did not do for it over
a session. One of its three findings was a misreading, and saying so is worth as much as the
two that were right.

"THE READING-PASS HOLD NEVER FIRED, AND `journal cleanup` CONFIRMS IT SHOULD HAVE — it
printed 'never done on this environment'." The hold is working. `owed()` gates it on the
oldest standing claim being at least READ_DAYS (21) old, deliberately: every record starts
never-read, and a store that nags from its first pin teaches its reader to ignore the line
before there is anything worth reading. Verified both ways — a 2-day-old claim gives
`owed=False`, a 30-day-old one `owed=True`.

But the reader had no way to know that, because the line stated a fact and withheld the
qualification that makes it mean something. It now reads "never done here, and not owed yet
— nothing standing is 21 days old" until a pass actually is owed. The condition was right
and only the sentence was silent, which is the same defect as the six stale claims in 1.46.1,
one level down.

"POINT THE PINS NUDGE AT `cleanup read`, NOT `pins`." Right, and cheap. In their words:
"Both times I obeyed it, spotted one wrong pin, fixed that one, and moved on. It never
occurred to me to run the full cleanup, because nothing in the nudge said cleanup — and
re-reading pins is exactly the moment you'd catch a dead one." When a pass is owed the recall
nudge now names the pass; when it is not, it stays the two read commands.

"PINS GO STALE PRECISELY WHEN A STRETCH OF WORK CHANGES THE CODE THEY DESCRIBE." The sharpest
of the three. `work end` has asked "did that teach anything a later reader would get wrong
without?" since 1.19.0 and never once asked the other direction — and their pin 1 "was false
the instant the fix landed, about eight hours before anyone noticed". Closing work now asks
both: what it taught, and what it just made untrue, with the strike commands beside it. It
asks; a gate there would be a third rule.

## 1.46.1 — the pages that describe the block, describing the block that exists

1.45.0 changed what a session is handed and did not change what the README and the skill say
it is handed. Six claims, each of them false the moment that shipped, and every one of them
in a page written to be believed:

  - "the abstract is all a later session sees until it opens the doc" — it is the TITLE.
    The instruction that told agents where to spend their care was pointing at the half the
    doorway no longer carries, so the guidance is now: write a title that survives alone.
  - "the claim is re-read in full at every session start" — it is shortened to a line there.
    Which changes how a pin should be WRITTEN: what it rules goes first, the qualification
    after, because the first line is what crosses.
  - "the start block lists what is waiting" — it counts them; `journal todos` lists them.
  - "every session is handed the catalogue" of tools — it is handed the count, twice, in
    both the README and the skill.
  - "Five Claude Code hooks do the enforcing" — seven, since 1.42.0 added WorktreeCreate and
    SessionEnd was never counted.

AND `environments remove` WAS NEVER IN THE README at all, which mattered little while it
archived and matters now that it deletes. It is there with what it destroys spelled out.

A DOC THAT DESCRIBES A MECHANISM IS PART OF THE MECHANISM. This package's whole argument is
that a claim nobody re-reads goes stale silently; five of these had gone stale in one commit
and none of the 1,453 checks could see it, because a test asserts what the code does and
nothing asserts what the prose says the code does.

## 1.46.0 — remove means remove

`journal environments remove --yes` deleted nothing. It MOVED the environment to
`.journal/removed/<name>-<stamp>/` — under `environment` if `environments/<name>/` had been
created, under `todo` if it had not. That folder is created lazily, so the same command
seconds apart put a user's pins and to-dos in either of two places. `--purge` was the flag
you had to type to get an actual delete.

A RECOVERY PATH DECIDED BY A RACE IS NOT A RECOVERY PATH. This was the intermittent
`test_migrate` failure that took eight rounds to catch, and the fix is not to pick one of
the two shapes: it is that keeping a copy was never what the rule required. "Nothing
disappears without somebody deciding it should" asks that the user SEE what they are
destroying and type `--yes` knowing it. It does not ask for a hiding place, and the hiding
place is where the second shape grew.

So: bare `remove` prints what the environment holds — pins, open work, to-dos — and says
plainly that `--yes` deletes them. `--yes` deletes them, both layouts, unconditionally. The
record keeps one line saying the environment existed and what it held, which is an audit
trail. `--purge` is gone; there is one path.

Docs are still never touched: a doc scoped to the environment becomes the project's, because
an environment ending does not unmake what it settled.

AND A STRAY ARCHIVE WAS SHIPPED IN THE PACKAGE. `removed/dogfood-probe-20260909-211951/`
was committed from a dogfood run, and `testkit` copies the source tree, so every test
project was born with a `removed/` folder already in it. Deleted.

`journal carry` KEEPS NO CHARACTER CAP, and that is now a decision rather than an omission.
Only the doorway is injected — both hook call sites use the brief depth, and a test fails if
that changes. `carry` prints to a terminal, where the 10,000-character ceiling does not
exist, and it is meant to be read INSTEAD of the record; cutting its entries to a line would
defeat the one thing it is for.

## 1.45.0 — the doorway carries pointers, and a pointer has a fixed size

1.44.1 bounded the injected block by measuring it and tightening until it fit. That is a
ceiling, and a ceiling is not a design: it says what the block may not exceed, not what
belongs in it. This says what belongs in it.

A DOORWAY IS A POINTER. Every entry is one line, capped at 180 characters by `fmt.gist`,
and beside it the command that reads it whole. Nothing in it is content:

  - A doc is its TITLE. The abstract was the largest content in the block — three of them,
    of no fixed length — and it is what `journal docs <n>` is for.
  - A pin's doc citation is `→ doc 88.1`, not the doc's title and its part's. That suffix
    was 150 characters hanging off an entry that had just been capped at 180, which is how
    a bounded line grew back to 267.
  - The shipped rule is gisted like any other. It is written in `builtin.py` rather than
    read from a store, and it escaped every cap by being hardcoded — a bound the special
    case walks around is not a bound.

OPEN WORK MOVED TO SECOND, above the rules, and is its title alone. A summary is passable at
narrative and hopeless at standing orders, and open work is the standing order that decides
what the next thirty seconds are spent on; it sat seventh, under three rules and three doc
abstracts, where it read as trivia. And when nothing is open the brief block SAYS nothing is
open: an omitted section reads as "not mentioned", which leaves a reader unable to tell the
two apart.

`fmt.cut` NOW REPORTS A SHORTENED LINE, not only a dropped entry. It named the reading
command when the COUNT was trimmed, so a doorway showing three of three rules — every one
of them cut to a line — printed no command at all, and the reader held three half-sentences
with no way to finish them. That is the silent-forgetting failure `cut` exists to prevent,
arrived at through the other cap.

A CAP OF ZERO MEANT TWO OPPOSITE THINGS. Tools and to-dos read it as "not at this depth";
`pins.carry` read it as "no limit". So the store the tightening loop pushed to zero became
the unbounded one: dropping rules to 0 grew a real block from 14,755 characters to 44,988.
Zero silences a section everywhere now.

WHAT IT MEASURES. On this project the doorway went 4,706 → 1,915; on a real record with 130
rules, 85 docs and 125 to-dos, 5,266 → 4,529. The property that matters is not the number:
a test now asserts the doorway is FLAT against the record it points at — ten times the
entries, under 60 more characters.

## 1.44.1 — the block that goes into context is bounded in characters, not entries

The harness replaces a hook string over 10,000 characters with a FILE PATH, so a block that
overflows is not truncated — it is not delivered at all. `carried` has measured itself and
tightened since that was found. The DOORWAY, added in 1.42.0, returned before that loop: it
was short because the long half is a command away, which bounds the NUMBER of entries and
says nothing about their length. Three pins at the 400-character cap, three rules, three doc
abstracts of no fixed length — nothing was watching, and it measured 4,708 against the
ceiling by luck of content.

"A count is the wrong unit for a character ceiling" is written above `CARRY_CAPS` about this
exact bug, one shape earlier. Both depths run the same loop now.

ITS FLOOR IS ONE, NOT THREE. The full block stops at three because below that it stops being
a hand-over; a doorway is not a hand-over at any size — it is a pointer, and one of each
with the count beside it still points. What it trims, it says it trimmed, with the command
that reads the rest.

AND ONLY THE DOORWAY IS INJECTED, which has been true since 1.42.0 and is now asserted:
`journal carry` is the full hand-over and prints to a terminal, where the ceiling does not
apply.

## 1.44.0 — a doc belongs to an environment, or to the project

`track:` on a doc was provenance and nothing filtered by it, so every environment was handed
every doc: eighty-four titles at a session start in one real project, almost none of them
about the work in front of the reader. A catalogue nobody can skim is the one thing a
catalogue exists to prevent. Meanwhile `cleanup` had quietly started reading the field to
decide what to flag — this codebase has never kept a field inert, and a field that describes
something always ends up deciding something.

It is a SCOPE now.

    journal docs add "<title>" --abstract="…" --brief      belongs to this environment
    journal docs add … --global                            belongs to the project
    journal docs move <n> "<environment>"|--global         change which
    journal docs --all                                     the whole shelf

SCOPE DECIDES WHAT IS LISTED, NEVER WHAT CAN BE READ, and that is why the scope lives on the
DOC rather than as a filter over the store. A rule binds every environment and may cite a
doc; a citation that stopped resolving outside one environment would make `--doc=` a trap.
Every doc stays readable by number from everywhere, and `journal docs` says how many are not
being shown, because a filtered list that does not announce itself is one somebody will
trust as complete.

NOTHING WRITTEN BEFORE THIS MOVES. An unset `track:` has always meant the project, and that
is what every doc written before this release has — so they are all global already and the
migration is nothing at all.

An environment that is removed no longer takes a promise with it: its docs are not deleted
and not archived away, they become the project's, because an environment ending does not
unmake what it settled.

## 1.43.3 — a suite that failed four times and never on demand

`test_migrate.py` reported one failed check, four times in one day, always inside a batch,
never alone. Ninety runs afterwards — alone, six at a time, and four full rounds of every
suite in parallel — were green. Both original sightings were on a machine that was also
running three dispatched agents.

TREATED AS LOAD, AND SAID SO RATHER THAN DRESSED UP AS LOGIC. Every command in these suites
spawns a real CLI, and the package's own start is ~90ms before it does anything; a
60-second subprocess ceiling is generous until a dozen of them compete for one disk, and a
timeout there raises inside the caller and is counted as a failed check with no line printed
— which is exactly the shape that was seen. The ceiling is 180s, in all 128 places that had
it, and the reasoning is written into the suite so the next person to see it knows what was
already ruled out and what to do if it comes back.

One correction to the record while chasing it: the first report said the FAIL line was never
printed. It is printed; the grep that looked for it re-ran the suite, which passed. A
measurement that reruns the thing it is measuring is not a measurement.

## 1.43.2 — `journal next` stops handing back a list the record has moved past

A hold's long half is written to the transcript's runtime file and `journal next` prints it.
Most held details are facts about the MOMENT — the line an untagged message was at, the
reading that tripped a context rung — and are as true later as they were then. A LISTING of
what is waiting is not.

Seen twice in one session: `work end` closed a row, printed "to-do N is done with it", and
the very next `journal next` offered N as the thing to start. Reading the snapshot cleared
it, so the second call was right — which is how it stayed hidden, and why the first attempt
to reproduce it through `todos done` found nothing. `next` is the command auto mode tells an
agent to run, so the one stale read lands on the reader least able to notice it.

The hold now records which to-dos were open when it wrote the text, and `next` shows the
snapshot only while that still describes the list; otherwise it drops it and answers from
the record. Nothing has to know which subjects list rows — a hold whose detail never
mentioned the list is simply never contradicted by it.

## 1.43.1 — a refusal says which journal is speaking

There can be more than one journal within a session's reach, and a subagent dispatched from
here runs under THIS project's hook whatever directory it was sent to work in. So an agent
working in another project, against another journal, is refused by this one and judged
against this one's record — and nothing in the refusal said so.

Measured: a dogfood agent sent to work three directories down in a scratch project spent
most of its run trying flag after flag against a journal that was never the one refusing it.
Every refusal it received was correct and none of them was answerable, because the two
halves of the sentence belonged to different projects. Every refusal now opens with the
project whose journal wrote it.

## 1.43.0 — a printed command carries the flags the reader has to type

`journal todos 1` ended its brief with the commands that act on that row — `journal todos
start 1`, `journal todos done 1 "<how>"`, and the rest — and none of them carried `--env` or
`--as`. A lent agent must put both on every command it runs. So the dispatch prompt said one
thing, the journal's own printed line said another by omission, and an agent that ran what
was printed hit a refusal it had just been told how to avoid. Found by a dogfood agent
working three directories down from the journal.

THE CLI CANNOT KNOW IT IS TALKING TO AN AGENT — that is the identity collision the grant
exists for, and it does not stop applying here. But it knows what THIS command line carried:
an agent that got as far as reading a brief typed the flags to get there, so every command
printed back to it is now spelled the way the one it just ran was. A session passes nothing
and sees nothing added, which is the case that has to stay clean.

ONLY BEFORE A VERB THE CLI ANSWERS TO, from the table `help` already keeps. `journal` is an
ordinary word in most of the sentences this package prints, and "the journal is in force
here" must not become "the --env=… journal is". A table is the difference between a rewrite
and a corruption.

## 1.42.2 — every printed path, not only the executable

1.42.0 rewrote `.journal/journal.py` to whatever runs from where the reader is standing, and
a dogfood agent three directories down found the gap the same afternoon: a to-do's brief
ends with the FILE it was written to — `.journal/environments/x/todo/001-….md` — and that
resolved only from the project root.

Every path this package prints starts with the same four characters, so every one of them
was wrong from the same places, and fixing the one that happened to be a command would have
left the rest to be found one at a time. The rewrite is on the prefix now.

## 1.42.1 — a wait that names what it waits on survives a write about something else

`work await` ends on the first write, on the reasoning that nothing still blocked edits a
file. That is right about the common case and wrong about the case awaiting actually
creates. Measured in this project's own session: it awaited a dispatched agent, shipped a
release while the agent ran — commits, a version bump, four to-dos closed — and the wait was
cancelled by its own writes; the next stop then asked about work that was still genuinely in
flight. "Nothing still blocked edits a file" is true of the session's OTHER work and says
nothing about this piece, and a wait cancelled by an unrelated write punishes exactly the
behaviour awaiting was built to allow.

A wait with `--agent=` or `--pid=` already had three endings that are not somebody typing:
the clock, the process exiting, and an explicit `work update`/`work end` on that subject. It
keeps those and gives up the fourth. A wait that names nothing — "waiting on the build",
with nothing to check — still ends on the first write, because for that one a write really
is the only signal there is. The two are told apart in the sentence `await` prints, so the
reader knows which kind they just filed.

## 1.42.0 — the journal is found by walking up, and a new worktree is handed one

THE LAYOUT THIS BROKE ON IS ORDINARY AND IN DAILY USE:

    worldwatchmarket/        no git here at all — but this is where .journal lives
      chronos/               a repository
        .claude/worktrees/…  Claude Code's own worktrees, three levels down
      site/                  another repository
      site-shopify-fix/      a linked worktree of `site`, sitting as a sibling

Every piece was correct for a session standing at the root and silently wrong from the four
other places an agent actually works. The journal found itself by where its own script sat.
The hook was registered as `"$CLAUDE_PROJECT_DIR"/.journal/hook.py` — and
`.claude/settings.json` is read from the STARTING DIRECTORY'S OWN `.claude/`, with no
parent-directory fallback, so in a repository under that root the hook was simply never
registered. And every printed line said `.journal/journal.py`, a path that exists only at
the top: an agent in `chronos/` ran what it was told and got "No such file or directory",
from a system whose entire job is telling an agent what to run. None of it announced itself,
because a hook that is not registered is silent by definition.

THREE FIXES, AND THEY ARE THE SAME FIX SEEN FROM THREE SIDES.

`worktree.nearest()` walks up for the closest `.journal`. No git, no remote, no assumption
about layout — and it is what a person does: the journal is the nearest one above you.

THE REGISTERED COMMAND WALKS UP TOO, from `${CLAUDE_PROJECT_DIR:-$PWD}`, bounded at forty
levels, exiting 0 in silence when there is nothing above — a journal that is not installed
above you is a different project, not an error. AND EXISTING INSTALLS ARE REWIRED: `install`
used to skip any event that already mentioned `hook.py`, so every project installed before
this would have kept the old command through every upgrade, for ever. It rewrites anything
that runs `hook.py` now, and leaves the rest of the file alone.

EVERY PRINTED COMMAND IS SPELLED FOR WHERE THE READER IS. `fmt.cli()` computes it once from
the journal's real location and the reader's directory: the relative form survives while it
is honest, and the absolute path takes over the moment it would lie. The rewrite happens as
the text leaves, in `fmt.block`, rather than at each of the forty sites that spell it — a
line written tomorrow is right without its author knowing there was a question.

AND A WORKTREE CLAUDE CODE MAKES IS HANDED THE JOURNAL AT CREATION. `WorktreeCreate` fires
for `--worktree`, for `isolation: "worktree"` and for a background session, and it is the
only announcement there is: no hook fires for ENTERING a worktree that already exists. The
new worktree's `.journal` becomes a symlink to the one above it, git in it is made blind to
that, and it is said once. A worktree that checked out its own copy is left exactly alone.

`test_nested.py` builds the whole shape — a non-repository root, two repositories, a
worktree under one and a worktree beside the other — and asserts from all four places that
the hook finds the journal, that the command the block prints runs from there, and that four
directories writing produce one record.

## 1.41.1 — nineteen modules imported for a command that uses two

`journal.py` imported docs, tools, context, migrate, update and verify at module scope for
every invocation, and `import dataclasses` — 5.9ms, pulling `inspect` behind it — for a
decorator whose only work was writing an `__init__` that assigns thirty defaults. `Opts` is
a plain class now; the class body still reads as the declaration it was.

The six modules load on first use, through one small proxy rather than an `import` inside
each of the forty functions that touch them — the same decision written forty times is one
more thing to forget on the forty-first. What is NOT deferred is anything the module-level
block needs while it runs: deferring one of those moves a side effect rather than removing a
cost, and a CLI that resolves its environment lazily is one whose commands can disagree
about which environment they are on.

A LAZY IMPORT IS ONLY AS LAZY AS THE EAGEREST THING ON THE PATH TO IT, and the first attempt
proved it by changing nothing: `pins` imported `docs` at module scope and `journal.py`
imports pins on every invocation, so `docs` loaded anyway. `pins` imports it in the two
places that render a doc citation now.

AND THE ESTIMATE IN THE TO-DO WAS WRONG. It said ~145ms of the CLI's start was those
imports. Measured, interleaved, twenty-four runs a side: 96.2ms to 91.8ms — 4.5ms, or 5%.
The rest of what `-X importtime` attributes to `docs` and `tools` is `shutil`, `subprocess`
and `tempfile`, which `state` and `worktree` pull in regardless and which nothing here can
avoid. `worktree` no longer imports either at module scope — correct on its own terms, since
a main checkout never reaches the code that needs them — but it buys nothing yet, because
`hook.py` still imports `tools` eagerly. That one is left alone deliberately: its handlers
register by decorator at import, and rearranging that at the end of a long session is how a
fast CLI becomes a broken one.

## 1.41.0 — a worktree is orthogonal, and `grant` lends the environment you are on

THE RULING, and it settles a question that had been open since worktrees and subagents were
built in the same week: A WORKTREE IS ORTHOGONAL TO THE JOURNAL. It is not an environment,
it does not hold one, and it never decides one. It exists so several agents can work one
project at once without touching each other's files — a fact about the filesystem, not about
the record. Whoever enters a worktree keeps the environment they were on, and an agent
dispatched from a session works that session's environment with its own ledger under it.

"An agent with its own journal" and "an agent in a worktree" were conflated and are two
different things: THE LEDGER COMES FROM THE GRANT, THE FILES COME FROM THE WORKTREE. The two
meet without knowing about each other, which is why nothing had to change when they did —
`worktree.py` names neither environments nor tracks, and never did.

    journal grant            lend the environment you are on
    journal grant "<other>"  lend a different one — a separate line of work for the agent
    journal grants           what this session has lent; `grant --list` is the same

BARE, IT LENDS WHERE YOU ARE, because that is the ordinary case and it was the one thing the
command could not do. Requiring a name made the unusual case the only case: this session lent
three brand-new environments to three agents in an afternoon because naming one was the only
way to lend anything at all. The bare form had to give up one of its two meanings, and "show
me what I lent" is the one a reader can ask for by another name.

## 1.40.2 — an unstartable list names every reason it is unstartable

The stop's "nothing on the list can be picked up" counted two of the four ways a row can be
unstartable and left out the one the reader can actually act on. Measured here: a list
holding one to-do waiting on the user and one set aside reported "1 set aside on a
condition" and never mentioned the question — while `journal next`, asked the same thing one
command later, reported the question and never mentioned the set-aside row. Two messages,
two different halves of the truth, neither of them wrong on its own, and between them no way
for the reader to learn that both were true.

All four are counted now — waiting on your answer, set aside on a condition, waiting on a
to-do that must land first, held by an agent still working — from one table, with the one
the user can act on first.

## 1.40.1 — a to-do that was ever asked a question stopped lying about itself

`ask()` records a question and nothing ever clears it — correctly, because the exchange is
the record of why a row is what it is. But the state ladder tested `t["asks"]` bare, third
from the top, so any to-do that had EVER been asked a question shadowed every state below
it: started, assigned, reported, blocked, after. A row could be picked up, worked, and
reported finished while still printing "waits on the user", for the rest of the project.

History was being read as state. The predicate is precise now: waiting on the user means a
question with NO answer that nobody has picked up. Starting such a row is an agent saying it
will proceed without an answer — legitimate, and previously invisible.

AND THE LADDER SAYS WHAT IT IS. A first draft of the replacement claimed the nine predicates
could not overlap; 237 of the 256 field combinations do. `blocked` and `started` are both
true of a row that was picked up and then set aside, and that is not a defect — what a
reader needs is why it is not moving NOW. So `_STATES` is a documented PRIORITY ORDER,
answering one question top to bottom: what is the most recent thing that decides what
happens to this row next? And `states_of` exposes every state that matched, because a ladder
returns exactly one answer and a rung in the wrong place shows up only as a wrong answer in
a case nobody thought of — which is how this bug survived as long as it did. The precedence
is asserted in `test_todo` rather than left to the reader.

Found by a dogfood agent folding this listing into the shared one, which preserved the
behaviour and reported it rather than fixing it silently. That was the right call.

## 1.40.0 — journal lent, and the name was already on disk

`journal lent` is the agent's half of `journal grant`, read as a question: what have I been
lent? It answers with the agent's own name, the environment, and the flags every command of
its needs. Until now an agent learned its name as a SIDE EFFECT — it ran whatever tool it
ran first, and the hook attached the briefing to that result. It worked, and the moment was
an accident of whatever the agent happened to do.

    journal lent      what am I, and what was I given

THE CLI CANNOT ANSWER IT, AND SAYS SO. `agent_id` reaches the hook and never the process —
the identity collision this whole mechanism exists for does not stop applying to the command
that asks about it. So the CLI half prints what a SESSION should hear, and the hook answers
an agent on the tool's result, where the id exists. One command, two readers. It answers
every time it is asked, unlike the one-shot briefing, which stays as the rescue for an agent
that never thought to ask.

THE READABLE NAME WAS ALREADY ON DISK AND NOBODY HAD LOOKED. The open question was how a
subagent comes by a name a person can read: `agent_id` is a hex string, and the obvious
alternative was to let the agent invent one — which then has to be checked for collisions
against every live agent and bound back to the real id anyway. None of that is needed.
Claude Code writes each subagent's transcript to `<project>/<session>/subagents/agent-<id>.jsonl`
with a `.meta.json` beside it holding the DESCRIPTION the dispatcher typed. It is unique per
dispatch, written by the one party with the context to name the work, and on disk before the
agent's first tool call. The briefing wears it beside the id:

    YOU ARE AGENT `afdfe440` — "Flag and command tables" WORKING UNDER `flags`

A label on a verified identity, never a substitute for one: every gate still turns on
`agent_id` from the payload.

BOTH FLAGS OR NEITHER. A lent agent's write now needs `--as=<its name>` as well as `--env`.
Without it the write lands in the environment's shared `work.json` instead of the agent's own
ledger — the collision the sub-environment exists to prevent, arriving silently. Measured in
the last release's dogfood: an agent ran `todos start 1` with no `--as`, was answered
"open: …" with no complaint, worked the row, and was refused by `report` with "held by
nobody". THE CHECK IS AT THE GRANT DOOR BECAUSE THE IDENTITY IS THERE — a first attempt put
it in the CLI, where it fired for the parent session too and was still only a guess.

AUTO PREDICTS THE STOP, SO IT ASKS THE STOP'S QUESTION. `todos auto on` named the first OPEN
to-do while the stop hook it was describing picks the first READY one, so it promised to
start rows that wait on the user, are blocked, are held by a live agent, or have unmet
prerequisites. Measured the moment auto was switched on here: it named a to-do that had been
waiting on the user for five hours. And a list that is full but entirely unstartable now says
so, rather than naming one or claiming the list is empty — from the outside those look
identical, and the difference is the half the user has to act on.

## 1.39.0 — the start block is a doorway, and three agents found four bugs in the grant

THE BLOCK STOPPED BEING DELIVERED AT ALL. Measured in a real project: 14,996 characters
against the harness's documented 10,000 ceiling, so the whole of it was replaced with a FILE
PATH — after every compaction that project's agent was handed a path instead of the record,
which is the one delivery this package exists to make. 7,014 of those characters were two
answered to-dos printing the user's answer in full, and no cap could reach them:
`CARRY_CAPS` bounds the NUMBER of entries and nothing bounded the text inside one, so the
halving loop hit its floor and gave up.

So the injected block is a DOORWAY: where the session is, what the commands are, how many of
each thing stands — and the agent reads what it needs.

    journal carry     the full handover, uncapped, on demand

    carried(BRIEF)    what the hook injects        5,067 characters on that same record
    carried(FULL)     what `journal carry` prints

ONE BUILDER WITH A DEPTH, not two functions: a separately written short version is the thing
that drifts from the long one. Reminders leave the block entirely — they fire at every stop
and every `reminder_every` calls, so injecting them paid for the same text twice. The
answers, and the questions waiting on the user, leave with them; rules, pins and docs keep
their last three; a counts block names what is left and the command that reads each. AUTO
SURVIVES AS AN ORDER, not a listing — everything else the doorway drops is readable on
demand, and a standing order is not readable at all: a session in auto that is not told so
simply stops.

LENDING MAKES THE ENVIRONMENT IT LENDS. `journal grant "<name>"` refused an unknown name and
pointed at `prepare`, which CREATES AND SWITCHES — so lending three environments to
subagents cost six moves of a session whose whole definition is "this session does not
move". `tracks.create` is now the one place an environment starts, and `switch` and `grant`
both call it.

PINS AND REMINDERS ARE INHERITED, NEVER WRITTEN, BY A LENT AGENT — the user's ruling, and it
was neither enforced nor true: both were allowed, and `journal grant` printed `pins add` as
its example, so the briefing a dispatcher pastes into a prompt taught a command the design
forbids. The reason is provenance, not blast radius: a pin belongs to one environment
exactly as work does, but it is re-read in full at every compaction by every session that
binds there and nothing revisits it, so a claim whose reasoning nobody in the main
conversation saw would stand in the record's highest-authority position forever.

FOUR BUGS, FOUND BY DOGFOODING. Three sonnet agents were dispatched into three git
worktrees, each lent its own environment, each given a real refactor. They found:

  THE HOOK TOLD ALL THREE THE WRONG ENVIRONMENT. `agents.briefing` took `lent[0]` — the
  first environment the session happened to have lent — and stated it as fact, on the first
  tool call, in the one sentence whose entire purpose is "here is the flag you must put on
  every command". It is the same failure the refusal had and had already been fixed for: a
  message that names an environment nobody told this agent to use will be obeyed. With one
  grant standing it is named; with several it names none and says the dispatch decides.

  `work end` CLOSED A ROW A SUBAGENT MAY ONLY REPORT. `report` refuses to close and says the
  parent does it; then `work end`, on the subject `todos start` itself opened, closed the
  same row through `close_titled` — unconditionally, with no idea who was calling. One agent
  guessed the hint did not apply to it and worked around it; the other followed the
  documented order exactly and marked its own homework. The guarantee held everywhere it was
  written down and nowhere it was wired.

  `todos start` WITHOUT `--as=` HELD NOTHING, SILENTLY. "open: …", no complaint, and then
  `report` refused with "held by nobody" — the command that could have said it said nothing.

  `journal reminders` — A LISTING — HAS COUNTED AS A WRITE for as long as the noun has
  existed: gated behind open work, and refused outright to a lent agent told to read what it
  inherits. It was missing from a chain of five `if verb == …: continue` branches. That is a
  table now, so a noun with no entry is visible rather than silently a write.

WHAT THE AGENTS BUILT

`journal.py:main` is 85 lines, from 515: a flag table and a command table replace ~30
`elif a == "--x"` branches and ~40 verb branches. Aliases are one row with several names —
`environments`, `environment`, `envs`, `env`, `tracks`, `track` is one entry, not six.

`entries.listing` is the loop every listing shares once it has its own items, and
`todo.render`, `docs.catalogue` and `tools.catalogue` fold into it, each supplying only its
own `facts`. The to-do's meta became `_state` plus a table.

`fmt.notice` is the one shape for the `journal: …` line that six places each spelled
differently, and `install.py`'s nine raw prints go through `fmt.say` — the installer had
never touched the formatter at all.

## 1.38.1 — the duplicate 1.38.0 said it had removed

`reminders.render` was still the hand-written 33-line listing that 1.38.0's entry claimed
had been replaced by the shared loop. The new `listing` was added beside it and the old
body was never deleted, so the module carried both and the tests passed because `render`
still worked — nothing asserted it went through `entries.rows`. It does now, and a test
asserts the module holds no second copy.

AND THE WORD "SHARED" IS WRONG FOR CODE IN THIS PACKAGE. Three docstrings said the listing
was "shared with pins and rules", where "shared" has a settled meaning: a rule is visible on
every environment, a pin and a reminder are not. Nothing about scope changed — `state.TRACKED`
still puts pins, work and reminders in the environment's folder and `rules` still lives in
the record, untouched by a switch — but a docstring that borrows the vocabulary of the data
model to describe a refactor is a docstring that will be believed. They say "one loop, three
nouns" now, and say outright that it decides nothing about visibility.

## 1.38.0 — output is described, never formatted at the call site

`fmt.say` was one exit and no shape. Every one of its 546 callers assembled its own string
first — a title, a `\n\n`, a command block, another `\n\n`, a footer — so the blank lines,
the order, the indent and the trimming were re-decided at every site. That is why the same
complaint about a wall of text came back in a different screen three times: there was no
place to fix it once.

A command now describes WHAT it is saying and never how.

    Item(text="…")                    a paragraph
    Item(n=2, text="…", meta="…")     a pin, a to-do, a reminder
    Item(title="journal x", text="…") a command, a setting — anything in a column
    Out(title=, sub=, lead=, items=, footer=, error=)

Which shape a row takes comes from `Item.layout`, decided by what the caller filled in —
there is no way to ask for a shape by name and no way to ask for one the fields do not
support, which is what keeps the vocabulary at three. `fmt._LAYOUTS` maps each to the
function that lays it out: adding a shape is adding an entry, the signatures are uniform,
and no caller can reach a half-applied branch. An `Out` among the items is a SECTION,
rendered by the same function one level in, so a page with several groups is built without
any caller joining two rendered strings together.

`fmt.render` is the only code that decides where the air goes, and it decides it from the
rows: two columns sit together, anything else is separated. A group whose widest name would
leave less than 34 columns to read in stacks instead of columning — measured on
`journal reminders`, where one 58-character command turned every description into a
four-line sliver.

THE THIRD SHARED OPERATION ON A NUMBERED STORE. `entries` already held one `retire` and one
`move` for pins, rules and reminders; the LISTING was still written out per noun — same
enumerate, same paging, same struck-keeps-its-number rule, differing only in which fields
went into the line beneath. `entries.rows` is that loop, and a store supplies its own
`facts` strategy. `pins.listing` and `reminders.listing` return rows rather than text,
because a page handed rendered text can only paste it in as a paragraph — which reflowed a
numbered list into prose the first time it was tried.

A refusal is marked once, on its first line, BEFORE the wrap. Marking after it shifts the
line by four characters without re-wrapping, so the break points move and a command splits
across two lines.

Rule 3 is written into the journal: clean, DRY and idiomatic before it is committed, never
after it is complained about.

## 1.37.3 — the reminder is the message

The block read `REMINDERS — 3 things you asked to be told again:` above the instructions.
That is the package narrating its own delivery — who asked for them, how many there are,
and that this is a repeat — none of which is the instruction, all of it charged to the
reader at every stop for the whole session. The heading is one word now: `REMINDERS:`. A
label survives because a block of numbered lines dropped into a stop with nothing above it
is a list of unattributed orders; the sentence does not.

## 1.37.2 — the README documents the CLI that exists

It described `journal handoff` and `journal delegate` as live features, with a paragraph
each on how to use them, two releases after they were deleted — and said nothing at all
about grants, sub-environments, assignment, reminders, or the rules the journal itself
ships. `.journal/record.json` was still documented as holding pins and work, which stopped
being true in 1.34.0 when an environment became a folder.

Rewritten: what a grant is and why a subagent cannot simply be detected, what a
sub-environment holds and what it may not touch, the reminder, the real storage layout
including `environments/<name>/agents/<id>/work.json`, and the paragraph on worktrees now
carries the half that was only assumed until it was measured — a subagent's FIRST TOOL
CALL is what links a worktree's journal, because no session start fires for one.

DOCUMENTATION DRIFTS SILENTLY: nothing fails when it goes stale, which is why it went stale
for two releases. So a test now asserts that every `journal <verb>` the README prints is a
verb the CLI answers to, and that no retired name is presented as a live one. It cannot
check that prose is true; it can check that the commands are real.

## 1.37.1 — a removed command says what replaced it, and prose keeps its paragraphs

`journal delegate` and `journal handoff` were removed in 1.37.0 and fell through to "No
such command", which reads as a TYPO. The reader is most often an agent working from an
older prompt, a shipped skill, or a colleague's runbook written against a version still
installed somewhere — and an agent told only that a command does not exist retries the
spelling, which is the one thing that cannot work, and then routes around the journal
altogether. Both names still answer, with the shape of what replaced them: the commands
themselves, in order, and what to put in the dispatch. `help.RETIRED` is the one place a
removed name lives, and a test asserts no name in it is one the package still answers to.

PROSE KEEPS THE BREAKS ITS AUTHOR WROTE. `fmt.wrap` is the funnel every command's prose
goes through. It split on the blank line, wrapped each paragraph, and rejoined them with
ONE newline — so every multi-paragraph message in the package arrived as a single block
with its breaks silently removed. Its docstring had claimed the opposite since it was
written, which is why nobody looked: the separator was read once, believed, and never
measured against what came out. It is also why the same complaint kept coming back about
different screens.

AND SEVEN REMINDERS ARE SEVEN READABLE THINGS. The stop's reminder block built its own
lines and wrapped none of them, so seven reminders arrived as seven unbroken
180-character strings stacked with no gap. The user's word for it, twice: a wall of text.
It goes through `fmt.numbered` now — the same renderer the list itself uses — with a blank
line between items. An instruction nobody can find the start of is not being delivered,
however reliably it is printed.

A refusal is also marked once rather than once per paragraph: `fmt.say(error=True)` puts
`!` on the first line of every call, so a refusal built from five calls announced itself
five times, and a marker repeated down a page means nothing.

## 1.37.0 — a subagent writes only what its dispatcher lent it

A subagent cannot be DETECTED. Its shell carries the dispatching session's id, so a
`journal pins add` inside one is, at the operating system, the same act as the parent
running it; `agent_id` exists only in the JSON a hook receives, never in the process the
subagent runs. `journal delegate` worked around that by binding the SESSION, so subagent
writes landed somewhere by accident of sharing an id — and cost nine `is this a subagent`
branches across six functions before it was deleted.

What cannot be detected can be lent.

    journal grant "<environment>"        lend it to this session's subagents
    journal grant                        what this session has lent
    journal grant --off "<environment>"  take it back

The grant is declared TWICE: by the session, in the record; by the subagent, with
`--env="<name>"` on every command. The hook holds the two against each other at ONE door,
and no other line asks what kind of actor is calling. `journal grant` prints the sentence
to paste into the dispatch, because that sentence carries the flag the mechanism turns on.

WHAT A LENT AGENT MAY TOUCH, measured by hashing the tree before and after its whole write
repertoire: `environments/<lent>/work.json`, `pins.json`, `reminders.json` and `todo/`.
Nothing shared. That property is why `rules`, `docs` and `tools` are refused rather than
discouraged — each writes where every session reads. `switch`, `claim`, `prepare`, `grant`
and their `environments` spellings are refused too, for the other reason: they move a
SESSION, and the session they would move is the dispatcher's.

FIVE OF THOSE REFUSALS REFUSED NOTHING when this was first written. `claim`, `grant`,
`environments`, `handoff` and `delegate` were named as forbidden while `_journal_write`
classified them as not-a-write, so a granted subagent could have evicted a live session.
`JOURNAL_WRITES` is the complete definition of a write now, including the noun spellings,
and a test asserts the two lists cannot drift apart. `_journal_write` also missed any verb
with a flag in front of it — `journal --env=x pins add` passed every gate in the package.

A grant dies with its session, which was a sentence before it was a fact.

A LENT AGENT GETS A SUB-ENVIRONMENT, NOT A SHARE OF ONE. Two subagents on the same
environment used to write one `work.json` between them, so either could close the other's
declaration by saying its words. Work is now per-agent —
`environments/<lent>/agents/<id>/work.json` — and only work is: pins and reminders stay the
parent's, read-only, which is what keeps the inheritance one-directional instead of a
cascade with two places to look. A subagent still cannot write a pin.

    journal assign <n> --to="<agent>"     hand a to-do to one agent; --off gives it back
    journal todos start <n> --as=<agent>  claim an unheld row and start it
    journal todos report <n> "<how>"      say it is finished; the parent closes it

A held row leaves the ready list, so nobody else is offered it, and the hold lapses on a
heartbeat rather than a promise, because nothing can tell us a subagent died. It may report
and it may never close: a runner that ticks its own box is a failure this project has
already watched happen.

The agent is TOLD ITS OWN NAME, once, on its first tool call — the CLI cannot see
`agent_id` and the hook can, so the hook answers on the tool's result. `PreToolUse` cannot
carry `additionalContext` in this harness, measured, whatever the reference claims.

STARTING A ROW CLAIMS IT. Found by dogfooding: a subagent started a to-do, worked it, and
was refused by `report` for holding nothing, because `started` and `assigned` were two
facts and only a dispatcher set the second. The row it was working stayed offerable to
anyone the whole time. `start` claims through `assign` now — one funnel for the hold, so
the refusal is the same sentence whichever door it came in by.

A SUBAGENT IN A WORKTREE OF ITS OWN WRITES THE ONE RECORD, and nothing had to change for
that to be true. Nothing fires a `SessionStart` for a subagent, so the linking of a
worktree's checked-out `.journal` cannot depend on one — `resolve` runs at the import of
`hook.py`, so its FIRST TOOL CALL is both the event that names it and the event that
replaces the copy with a symlink. Its ledger, its claim and its report land in the main
checkout; the grant still refuses a rule from inside the worktree; git there sees nothing
of `.journal`. The worktree decides where its files are and the grant decides what it may
write — two mechanisms that do not know about each other, which is why they met without
incident.

ALSO IN THIS RELEASE

`builtin.py` ships the journal's own rules — one today, that a subagent runs on the
cheapest model that meets the task. They cannot be struck, they are numbered apart so no
citation moves, and `install.py` writes them into `AGENTS.md` and `CLAUDE.md` as a managed
block between HTML markers, replaced on every update, everything outside them untouched.
`builtin_rules: false` turns them off.

`journal switch` has printed "0 pin(s), 0 open" since 1.34.0 — it counted from a registry
that stopped holding those numbers. It reads the environment's own files now, and says
which reminders it just silenced on the environment being left.

`carried()` measures itself against the harness's documented 10,000-character ceiling and
tightens its per-store caps until it fits: a record of 125 rules, 194 pins and 163 to-dos
went from 120,360 characters — which the harness replaced with a file path nobody read —
to 5,252, every cut naming what it left and the command that reads it. `journal verify`
reads the transcript back and says whether the last start block ARRIVED.

`journal todos block <n> "<condition>"` sets a row aside on something that is not a
question for the user, and `journal todos after <n> 12,14` on to-dos that must land first;
both are skipped by `next` and by auto, and the second goes ready on its own. `--doc=1.2#a-heading`
cites one section of a doc. A `recall` subject says how many rules and pins stand, a few
times a session, never their text.

And the stop's output is a heading and an indented instruction rather than a run-on line,
said once, in one field — guidance travels in `additionalContext`, which the reference says
holds exactly as `decision: "block"` does without the harness calling it an error.

## 1.36.1 — a reminder comes back every 50 tool calls, not every 15

`reminder_every`'s default. A reminder is the one channel in this package with no
condition on it, which makes it the one channel that can teach the reader to skim — and
everything here that fired on a condition rather than a record ended up doing exactly
that. A repeated line is not read harder for repeating sooner; past some interval it stops
being an instruction and becomes furniture, and the agent it was written for is the reader
least able to notice when that happened. 50 is far enough apart to still land as an
interruption, and still several times in the kind of stretch a reminder is written for.

Set `reminder_every` to go back to 15, or to 0 to leave reminders to the stop entirely.

AND THE REPEATED FORM CARRIES NO FURNITURE. Each firing used to wrap the instruction in a
header, a gloss on what `--until` means and the command that retires one — three lines of
scaffolding around one line of instruction, arriving all session long. That is how a
reader is taught to skim, and what they learn to skim is the reminder. Mid-turn is now the
instruction and its condition, full stop; the command that ends a reminder is still taught
at the head of every stop chain, which is also the copy the user sees.

## 1.36.0 — an instruction you keep having to give is said back to you

A pin is told once. Every channel in this package hands the record over at a start and on
the far side of a compaction, and then it sits in a window that grows by tens of thousands
of characters an hour — an instruction fifty tool calls back is read with less weight than
the result that just landed. That is drift, and pinning harder does not fix it.

    journal reminders add "<the instruction>"                 said again at EVERY stop
    journal reminders add "<…>" --until="<the condition>"     …until the agent judges that true
    journal reminders                                         what is being repeated here
    journal reminders done <n> "<what made it true>"          retire one; the reason is required
    journal reminders move <n> "<env>"                        it belongs to an environment, like a pin

A reminder is the ONE thing here that repeats. The stop queue raises one subject per stop
on purpose — a wall of reminders is read past as one — so a reminder does not join it: it
is folded into whatever the stop was already going to say, and it survives
`hold_stop_on_untagged: false`, which turns the queue off and was never a statement about
what the user asked to be told again. Between two stops there can be an hour of tool
calls, which is the stretch the reminder was written about, so it comes back every
`reminder_every` calls (15; 0 leaves it to the stop) — agent-only at that cadence.

AND THE USER SEES IT AT THE STOP. Every other hook line is the agent's business rendered in
somebody else's terminal, which is why a hold was cut to one line. This is the exception:
they wrote it, and the line coming back is the confirmation it landed. The instruction goes
to the agent in the field the harness folds away, so the terminal gets one added line.

`--until` IS PROSE AND THE AGENT IS WHAT EVALUATES IT. Nothing in here can check "the
migration tests pass on CI", and a condition language would only ever cover the conditions
somebody thought to implement. The condition is handed back at every firing and the agent
retires the reminder itself, the way it strikes a stale rule. Nothing expires on its own:
the reason is required, the text stays under `--all`, and a reminder the user wrote and
nobody retired is one they are still owed.

Reminders belong to an environment, like pins — `reminder_max_chars` caps one (200, tighter
than a pin's, because it is re-read dozens of times in a session), and `silenced:
["reminders"]` turns both halves off.

## 1.35.0 — a claim keeps its reasoning, and `show` reads its noun

A rule is one line because it is re-read in full at every session start, every compaction,
every context rung and by every subagent — 125 rules is 30KB of that in a real consumer.
But the reasoning had to go somewhere, and for want of anywhere it went into docs: 78 of
them, 60 cited by nothing, and a rule citing a doc that exists while the doc is referenced
by the rule, so neither could ever be retired.

    journal rules add "<the ruling>" --brief        the reasoning on stdin
    journal rules show <n>                          the claim and its reasoning
    journal rules <n> --full                        the conversation it was written in
    journal rules amend <n> "<section>" --brief     append a section
    journal rules replace <n> --brief               swap it; the old text goes to struck/

Pins take all five too: `pins.py` is one code path over `key=`, pins are the bigger half in
that consumer (159 entries to 125), and `promote` copies a pin into a rule — so rules-only
would have meant every promoted rule arriving with an empty body. It carries the body across
now, or the argument would be dropped silently while the strike reason claims it went to
rule N.

TWO FIELDS, NOT THREE. The claim stays the one injected line and there is no title: 60 of
those 125 rules have no head clause that could become one, so an agent would invent it, and
an invented title above the claim is a second unversioned claim in the highest-authority
position this system has. `fact` cannot drift from itself. The writers had already invented
titles with punctuation — "RULING: …", "A design file is a SPECIFICATION: …".

THE BODY IS A FILE, uncapped, never injected: `.journal/rules/NNN-<slug>.md`, and
`environments/<name>/pins/` for a pin. The cap exists because injected text is re-read
forever; text that is never injected carries none of that cost, and capping it would only
push the overflow back into a doc.

AND IT DOES NOT SHRINK THE CONTEXT BLOCK. Say so plainly: even a brutal 120-character cap
takes only 40% off, because that block is 30KB from the COUNT of rules, not their length —
the longest standing rule is 345 against a cap of 400. This ships because the argument now
has somewhere it can be judged, and because the doc explosion stops.

`journal rules show <n>` READS THE RULE now, where it used to print a stretch of transcript.
`docs show 4` prints the doc and `todos show 3` prints the to-do; this was the one place
`show` did not read its noun. `rules <n> --full` still opens the conversation, and every
existing spelling still runs.

It is marked wherever a claim is printed — the carried block (one suffix, `·rules show 3`),
the listing, the environment page, and `hook._subagent_rules`, which has its own renderer and
would otherwise hand a subagent a rule with no way to know there is more. `cleanup` scans
bodies for the same rot it scans claims for, and its reading pass NAMES the body rather than
printing it: 125 claims is the point, 125 claims and 125 arguments is a wall nobody reads.

Two pre-existing bugs found on the way and fixed with it. The pre-flight cap gate matched
only `pin`, `remember` and `rule`, so `journal pins add` and `journal rules add` — the
canonical spellings — never reached it; and `JOURNAL_WRITES` was missing the plurals, so a
write spelled the way the skill teaches it was not recognised as a write at all. Both now
match, with a guard so the bare nouns stay reads, which a subagent must keep.

And `docs._load` caches the catalogue per process. `pins.carry` called `ref_label` once per
doc-citing entry and each one re-read all 78 docs off disk: 218ms to build one context block,
now 13ms.

## 1.34.1 — the CLI starts in two thirds of the time

Every `journal` command and every hook event pays the interpreter's start plus this
package's imports, and the suites make a couple of thousand of them — so this is the
slowest part of an iteration, and none of it was doing any work.

`dataclasses` was the cost. It pulls `inspect`, ~6ms, and three modules on the hot path
declared a dataclass for two attributes and an equality nobody uses: `tags.Tag`,
`transcript.Line` and `hook.Ctx`. All three are plain classes with `__slots__` now — which
is also smaller and faster to build, and a transcript makes thousands of `Line`s. `digest`
is imported where it is used rather than at the top of `journal.py`, since only the
transcript commands need it.

And `state._read` caches by path within a process, validated by a stat on every hit. The
record is read many times in one command — by the gate, by the renderer, by the command
itself — and in a large consumer that was a 700KB parse each time. Another process's write
changes the file's mtime or size, so the next read here misses and sees it.

    one journal command   106ms -> 68ms
    the whole suite        80s  -> 62s   (1265 assertions, 18 files)

What is left is a floor: the suite's wall clock is now its slowest single file, and that
file drives the real hook binary as a subprocess, which is what makes it worth having.

## 1.34.0 — an environment is a folder, and upgrades migrate themselves

WHAT BELONGS TO AN ENVIRONMENT NOW LIVES IN THE ENVIRONMENT'S FOLDER:

    .journal/environments/<name>/pins.json
    .journal/environments/<name>/work.json
    .journal/environments/<name>/todo/NNN-*.md

Pins and work sat inside `record.json` under `tracks.<name>`, and to-dos sat in a parallel
`todo/<name>/` tree — so "what is on this environment" was answered in two places that could
disagree, one of them a 700KB JSON blob. The record keeps the REGISTRY: which environments
exist, who holds them, where sessions are. It no longer keeps their contents. Removing an
environment is a folder move now rather than record surgery, and reading one small file
beats parsing the whole record for a list only one environment needs.

Rules and docs do not move. A rule binds every environment and every environment reads
every doc; both stay where they were.

AND MIGRATIONS RUN THEMSELVES. `migrate.py` holds an ordered list of (version, what it does,
how), and everything newer than the record's own `schema` runs, in order — because a
consumer upgrades from whatever version it happens to be on, which is never the version
before this one. A project pulled six weeks ago crosses four releases in one `journal
upgrade`.

It is not a flag and not a step in a changelog somebody reads later. `journal upgrade` runs
it, and so does the first CLI command or hook event that reads an older record — the package
is copied into consumers by file, not installed by a package manager, so "the upgrade
command ran it" is not a guarantee anybody has. The guarantee is that the first process to
notice does it. `journal migrate` says what is pending and what has run.

EVERY MIGRATION IS IDEMPOTENT AND SURVIVES A HALF-RUN. It moves what it finds and leaves
what it does not, so running it twice is a no-op, and a project that is half-migrated has
what the record still holds APPENDED to what the folder already has, rather than either side
being dropped.

## 1.33.0 — a to-do, a pin or a doc can move to another environment

Work gets reframed. What was filed under one name turns out to be a different thing, and
until now nothing moved: the only way to carry a to-do or a pin across was to edit
`record.json` by hand, which is the one operation this package exists to prevent.

    journal todos move <n> "<environment>"
    journal pins move <n> "<environment>"
    journal docs move <doc> "<environment>"

EACH ONE MOVES WHAT IT HONESTLY CAN. A to-do's file moves and its number changes, because
the number is the filename and numbering is per environment — so the reply names both
sides, and `moved_from` keeps the old address for anything that cited it. A pin is STRUCK
where it was and added where it went, which is `promote`'s decision for `promote`'s reason:
a pin's number is its position in the list, and lifting one out would renumber every pin
after it and make "pin 7" in an old transcript name a different fact. The strike says where
it went, so `pins --all` shows the trail from both ends.

A DOC BARELY MOVES AT ALL, and that is the point. A doc is the project's — every
environment reads it, and `environments remove` already refuses to take docs with an
environment. Its `track:` is provenance, not ownership: only that field changes, the folder
and the number stay, and every citation keeps resolving.

A RULE REFUSES TO MOVE. It binds every environment, so there is nowhere to move it to — and
the refusal says what that means: a claim that only describes one line of work was never a
rule. Strike it and pin it there.

Also: `docs.carry` handed the OLDEST twenty docs at every session start. `_load` returns
them ascending by number and `carry` sliced the front; 1.30.0 flipped every paged list to
newest-first and did not reach this one. In a project with 78 docs that hid every doc the
current work was about behind "and 58 more" — at exactly the moment the catalogue exists to
stop somebody re-investigating what a doc settles.

## 1.32.4 — an out-of-date git hook is refreshed, and the CLI starts faster

TWO THINGS. The hook's body is not part of the package a pull refreshes: it is written once
into `.git/hooks` and stays there, so 1.32.3's `--quiet` reached nobody who had already
installed it — the fix shipped and the noise continued. `--git-hook` now rewrites a
`post-commit` that is ours and out of date, and still never touches one that is not.

And `urllib.request` is imported where it is used instead of at the top of `update.py`. It
costs 13ms and drags in `http.client` and the email package, on a CLI whose entire run is
79ms and which almost never reaches the network: every invocation paid for the version
check, and the suites alone make a couple of thousand of them. 79ms to 67ms per call.

## 1.32.3 — the git hook is silent unless it closed something

Installed and used for one commit, the post-commit hook printed "f5dd46419 names no to-do —
a commit closes one with a trailer" on a commit that was never about a to-do. On every
commit. A line printed after every commit is a line that stops being read, including the
one that says a to-do WAS closed, which is the only line here worth anything.

`journal todos from-commit --quiet` says nothing when the message names nothing; the hook
passes it. Run by hand it still answers, because somebody typing it is asking.

## 1.32.2 — the trailer is read at column 0, so a quoted example does nothing

The match allowed leading whitespace. A commit message that DOCUMENTS this protocol shows
an example, and an example is indented — so the changelog entry for 1.32.0, which quotes a
trailer with a to-do number in it, was one line away from closing whatever to-do had that
number. The line must now begin at column 0.

Nothing else narrows. The trailer may sit anywhere in the message, above or below any other
trailer; the footer is simply where a reader looks for it. What changed is that a line with
a space in front of it is a quotation rather than an instruction, which is what lets this
package's own commits explain the feature without triggering it.

## 1.32.1 — the commit trailer works for commits you type yourself

1.32.0 read the trailer at PostToolUse, which covers every commit an agent makes and none
of the ones a person makes in a terminal. `.journal/install.py --git-hook` installs a
`post-commit` hook that runs `journal todos from-commit HEAD`, and `--no-git-hook` takes it
back out.

OPT-IN, AND IT NEVER CLOBBERS. `.git/hooks` is not the journal's to own — husky, lefthook
and pre-commit all live there, and a hook is not committed, so overwriting one costs
somebody a workflow with no diff to find it in. An existing `post-commit` that is not ours
is left exactly as it is and the one line to add is printed instead; `--no-git-hook`
likewise refuses to delete a hook it did not write. The hook itself cannot fail a commit:
git ignores its exit code, and it exits 0 before doing anything if the checkout has no
journal.

The hooks directory is asked of git rather than assumed, so it is right inside a worktree,
where `.git` is a file and not a directory.

## 1.32.0 — a commit closes the to-do it finishes

A to-do is finished by a commit, and closing it was a second command nobody owed anybody —
so the list filled with work that was done. The commit can say so itself now, in a trailer
on its own line, spelled as the command it performs:

    Journal: todos done 990
    Journal: todos done cli-streamline/4 the four corners are the vocabulary

The message is read off the COMMIT, not off the command that made it. That is the whole
design: a commit a gate rejected closes nothing, `-m` and `-F -` and an editor session all
behave identically because none of them are parsed, and the sha and subject are right there
to become the `how` — the record cites the change instead of summarising it.

A TRAILER, NEVER PROSE. Commit messages here argue about to-dos at length; "this closes the
placement question" is a sentence, and a matcher loose enough to read it is loose enough to
close the wrong thing. The line starts with `Journal:` or nothing happens.

THE NUMBER IS PER ENVIRONMENT. `990` resolves against the environment the session is on,
then against the only environment that has one — and refuses, naming them, when more than
one does. `<environment>/990` says it outright.

`journal todos reopen <n> "<why>"` came first and is the reason the rest is affordable.
`done` was a field with no verb that cleared it, so a wrong number could only be undone by
hand-editing markdown, which is not a price to pay for a close nobody typed. The reason is
required and the close it undoes is kept beside it.

It is taught in three places, because a command an agent meets and does not know exists is
a command that is not there: the skill, the `todos start N` output — which prints the exact
trailer for that number — and once a session at the commit itself, when a commit lands with
a to-do started and closes nothing.

`journal todos from-commit [<ref>]` does the same for a commit made outside a session; it
is what the git `post-commit` hook will call. An amend or a rebase re-running it is a no-op
with a note: a sha is acted on once, and an already-closed to-do is left as it is.

## 1.31.1 — `--brief` refuses instead of hanging

`journal todos add "<title>" --brief` with no heredoc behind it hung until the tool timed
out. `--brief` reads stdin to EOF, and the stdin an agent's shell hands a command is often
one nobody ever closes — so the read never returned and the CLI looked like it was
thinking. Reported from a live session: the agent's next several attempts were the same
command again.

The read is BOUNDED now, for the same reason the record lock is: ten seconds, then it
refuses with the spelling that works — pipe the brief in, or drop the flag and pass the
title alone. A read that ends at EOF with nothing in it refuses too, because a to-do or a
doc part filed with a blank brief is the same mistake, filed instead of caught. If some of
the brief arrived and the pipe simply never closed, what arrived is kept and a line on
stderr says so.

It covers every `--brief`: `todos add`, `todos amend`, `todos replace`, `docs add`, `docs
part`, `docs replace` and `tools add`.

## 1.31.0 — a long stretch no longer ends in silence

Seen on a live run: an agent finished four of fifty-six phases, wrote a full report and
stopped — with auto on, fifty-two to-dos waiting, work open and a loop running. Nothing
nudged it and the user had to continue it by hand. Its own footer said how long the stretch
was: eight minutes fifty-five.

`raised_this_turn` was the cause. It is read while `stop_hook_active` is true and cleared
only when it is false, and the subject loop skips anything already in it — so the budget
was ONE hold per stop-chain rather than one per unit of progress. An agent held once, that
answers the hold and then works for nine minutes, meets a stop where every subject it needs
is already marked raised. The longer the stretch, the more certain the silence, which is
exactly backwards.

The memory now expires on PROGRESS. Each subject records the transcript line it was raised
at, and stays quiet only while the transcript has advanced fewer than
`hold_again_after_lines` (25) since. A subject held a moment ago is still quiet; one held
twenty-five lines of work ago is not being nagged about — it is being told at the next stop
after real work. `hold_again_after_lines: 0` restores the old budget exactly.

Raising at every stop instead was tried in 1.29.0 for the loop subject and starved the
queue: a subject that never yields is a queue that never drains. The threshold is precisely
what separates the two, and the suite now holds both ends — a stop straight after the hold
stays silent, a stop after thirty lines speaks.

An older record holding a bare list under that key is read as "raised just now", which is
what it meant, and written back in the new shape at the next hold.

## 1.30.0 — every list that pages reads newest first

Pins, rules, to-dos, docs and tools are append-only, so their natural order is oldest
first — and with a cap that meant page 1 was the oldest fifteen entries and everything
recent was behind a `--page=2` nobody typed. The list a reader opens is a list they are
reading for what happened lately.

All five now read NEWEST FIRST, and `--order=asc` gives back exactly the old reading.
`--order` takes only `asc` or `desc` and says so when given anything else.

THE NUMBER TRAVELS WITH THE ROW. `pin 3` is pin 3 in either order: nothing is renumbered,
the store is untouched, and only the reading is reversed — the same rule that already keeps
a struck entry's number rather than closing the gap. The `… and N more` line carries the
order into the next page, so `--order=asc --page=2` continues where page 1 left off instead
of silently flipping.

Four modules had each sliced their own page by hand, which is four places for "newest
first" to drift apart. They share `fmt.paged` now, and `test_order.py` holds all four to
the same three promises.

## 1.29.1 — the fix a finding offers has to answer the finding

`cleanup` reported a doc whose environment had been removed and offered `journal docs
final <n>` to resolve it. Marking a draft finished has nothing to do with a dangling
environment: the stale thing is the field, not the status. A checker that suggests the one
action which cannot help is worse than one that says nothing, because the reader trusts the
suggestion and stops thinking. That case now says what is true — the doc still stands, edit
its `track:`, or strike the parts that no longer hold.

Found by running the command on this project's own record, which is also where the reading
pass proved its point: pin 12 ruled on a documentation bug that has since been fixed. It
named a real file and a real command, so every mechanical check passed it and always would
have. Only reading it against the code retired it.

## 1.29.0 — auto without a loop is refused, not merely mentioned

Auto is the promise that the list drains while the user is away. A session with no loop
stops at its first idle stop and the list sits exactly where it was, which is the one thing
auto exists to prevent — and the user measured the failure: agents turn auto on and forget
the loop, over and over.

It was a HOLD at the stop, and a hold leaks two ways. A subject fires at most once per
stop-chain, so an agent that worked through it was not asked again for an hour; and a hold
is advice arriving at the moment the agent is trying to finish, which is when advice is
easiest to step over. Three changes, in the order they bite:

`journal todos auto on` now prints the loop command in its own confirmation — the standing
rule is that a command is taught where it is NEEDED, and the moment auto goes on is that
moment, not the stop afterwards.

THE NEXT WRITE IS REFUSED while auto is on, a to-do is ready, and no loop is known. A
denial cannot be stepped over. Reads are never gated and neither is the journal's own CLI,
because `journal loop set` and `journal todos auto off` are the ways out and must always
run. A subagent and a delegated session are exempt, as they already were at the stop.

A third change was tried and rejected, and the rejection is worth keeping: making the loop
hold fire at EVERY stop rather than once per chain. The reasoning was that the loop is not
a reminder but the condition under which every later hold can reach anybody. The suite
answered in one run — it raised itself three stops running while the untagged message and
the open work behind it were never reached, and the chain could not end at all. A subject
that never yields is a queue that never drains. The hold stays once per chain like every
other subject; the forcing lives in the gate, where it can neither be stepped over nor
deadlock.

The transcript is read only on the last step before a refusal: a loop the journal can SEE
but has not recorded still counts, and that read is too expensive to do on every write.

## 1.28.1 — the hook stopped deleting the proof that it ran

`journal verify` and the status page have been reading the journal as DEAD in sessions it
was demonstrably running in, and the cause was the hook itself.

`_prune` drops the runtime file of any transcript this machine no longer has. Its `keep`
argument exists for the session that is starting — but only `tracks.prune` honoured it; the
file loop did not. A transcript is not always on disk when SessionStart fires, since the
harness writes it once there is something to write, so `transcript.find` reported the
starting session as gone and the prune deleted the runtime file that the same handler had
written one line earlier. `session_started` — the one mark that proves the hook fired —
went with it, while keys written after the prune survived, which is why the file looked
present and merely incomplete.

Every test that fires SessionStart created the transcript first, which is exactly why this
survived: the failing case is the one nobody wrote down. Two tests now cover it — the mark
survives a transcript that is not yet on disk, and a runtime file whose transcript really
is gone is still dropped.

 work whose declarer is gone can still be closed

`work end` closes by saying the same words, which assumes the closer is the declarer. That
assumption breaks for the one case nobody planned: work declared by a session that no
longer exists — a runner in a worktree that has been deleted, a crashed agent, a hand-off
nobody picked up. Its subject is unguessable, so it can never be closed, and it stands
forever holding every stop hostage with a hold nobody can answer.

    journal work end --force ["<note>"]

Every open piece closes, whatever the words are, and the words are kept beside each as
`ended_note` — so the record still says who closed it and why. The note is optional,
because requiring words for work nobody can name is the same trap one level down.

## 1.27.0 — a cleanup is two passes, and the mechanical one is the smaller

`journal cleanup` finds what a check can see: a claim naming a file that is gone, a
spelling the CLI does not answer to, an orphaned doc, an empty environment. All of it is a
fact about the world a claim POINTS AT, and none of it is a fact about what the claim
means — which is where the rot that matters actually lives. The rule that sent this whole
thread into being said subagents never write the journal. It named no file, misspelled no
command, and passed every check in the tool forever; what made it false was `journal
delegate` shipping, a fact living in another module's docstring. Only a reader connects
those.

    journal cleanup read      every rule and every pin, in full, with the questions to ask

It prints the claims WHOLE — nothing truncated, because a claim cut at seventy characters
is a claim judged on its opening, and the part that has stopped being true tends to live
further in. Beside each is its strike. Above them are the three questions, cheapest first:
is this still what the project does; does what it asserts still hold (grep before you
decide); would a reader handed this cold be misled by it.

THE RECORD KEEPS WHEN, NEVER WHAT. The pass is stamped per environment — that the claims
were put in front of a reader is all a CLI can witness, and it is enough to tell the next
session "never done on this environment" instead of nothing at all. Nothing expires and
nothing is struck automatically; `READ_DAYS` is only how long before the hook may mention
it.

The stop subject now speaks for both halves, and speaks when there is nothing mechanical
to say: an empty findings list is not a clean record, it is a record nobody has read.

## 1.26.0 — an environment can be removed, and the record can be cleaned

Two things the tool made the user do by hand.

AN ENVIRONMENT CAN BE REMOVED. `tracks.py` opened with "there is no delete", and it meant
it: the tool this package replaced dropped things quietly to stay tidy, and the answer was
to drop nothing ever. That was the wrong half to keep. What matters is that somebody
DECIDES, not that nothing can go — and a list that only grows is a list nobody reads, so
every finished piece of work and every experiment stayed on it forever.

    journal environments remove "<name>"            says what it holds, removes nothing
    journal environments remove "<name>" --yes      archives it under .journal/removed/
    journal environments remove "<name>" --yes --purge   deletes it outright

`--yes` writes the environment's pins and work whole to `environment.json` and moves its
to-do folder beside them, so what came off can be read or put back by hand. It refuses the
project's start environment (a new session would land nowhere), an environment a live
session is on, and this session's own. Docs are the project's and never go with it. The
removal is logged on the record, and stale sessions bound to the dead name are unbound.
`remove`, `rm`, `delete` and `forget` answer only under the noun: there is no top-level
`journal remove`, because a bare deleting verb is the one spelling a mistyped name must
never reach.

THE RECORD CAN BE CLEANED. Rules and pins are re-asserted verbatim at the top of every
compaction, in the highest authority the system has, and nothing revisits them — so the
user was revisiting them, by hand, pasting the same paragraph into session after session:
remove the obsolete rules, clear the docs nobody uses, strike the stale pins. A thing the
user has to say every time is a thing the tool has not learned.

    journal cleanup [--all]        (journal tidy is the same command)

It gathers only what has CHECKABLE evidence against it: a rule or pin naming a file that is
nowhere in the project or a backticked `journal <verb>` the CLI does not answer to, a doc
whose environment is gone or a draft with no parts in a fortnight, a to-do that has waited
on the user for a week, an environment with no pins, no open work, no to-dos and nobody on
it. Each is printed beside the command that retires it, with the evidence in the line so
the reader can disagree with it.

AGE IS NEVER EVIDENCE, and neither is prose that merely contains the word. A three-month-old
pin that still holds is the best kind of pin; a checker that flags it teaches the reader to
skim, and the next real finding goes past with the noise. Both false positives found against
a real record are now tests: the repo is named after the CLI, so a `journal <verb>` counts
only inside backticks, and a file that MOVED is a stale path rather than a dead claim.

WHAT NO CHECK CAN SEE is the rule that quietly stopped describing how anyone works — it
names no file and misspells nothing. So the report always ends with every rule in force,
numbered and aged, with its strike beside it, under a heading that says so. That part is a
reading list, on purpose.

Nothing is struck for anyone. A strike needs a reason and only hides the claim — `journal
rules --all` and `journal pins --all` still show it — so striking one you have read and
judged dead is cheap. The stop queue gained a `cleanup` subject, last and never held: when
the candidate set changes it says once that the record has entries with evidence against
them, because a command reachable only through the skill is a command the agent meets the
moment and does not know exists.

## 1.25.0 — a wait ends when the work starts again

`work await` buys silence: the stop stops nudging work that is in flight on something the
agent cannot hurry. That silence is right while the agent is blocked and wrong the moment it
is not — and the agent that has picked the work back up is the last thing in the system that
will remember to say so. The wait now ends by itself.

A WRITE IS THE SIGNAL, AND A READ IS NOT. Reading is what waiting LOOKS like: polling a log,
tailing an output file, checking whether the build is done. If any tool call cancelled the
wait, `await` would cancel itself on the first thing an agent did after filing it. A write
is different — nothing that is still blocked edits a file — and it is the same line this
package already draws at its gate, where reads are never refused and changes are. The
journal's own writes do not count either: `work update` while still waiting is a status
report, not the work resuming. And only the owning session's write wakes its own wait.

MEASURED, on the runner this came from: it awaited a subagent, resumed on its own, worked
for eighteen minutes and stopped into silence with the record still reading "in flight".
With this, its first edit ends the wait and the next stop holds it properly.

`held_work` is cleared with the wait, so the work can be held for again rather than
remembered as already-said. The `await` confirmation, `journal work help` and the skill all
say so at the moment the command is used.

## 1.24.2 — `work await` is taught where it is needed

`work await` shipped in 1.22.0, was documented in the skill and answered by `journal work
help`, and an agent working this very project still had to be told by the USER that it
exists. Both of those surfaces are opt-in, and the moment the command is needed is a stop —
work open, something in flight — where the hold offered exactly two ways out: `work end` it,
or `work update` where it got to. Neither is right when you are waiting on a build.

The teaching model here is "the block is the rules, the skill is the reasoning", and
`await` had been filed entirely under reasoning. It is in the rules now: the SessionStart
block's work line names it beside start, update and end; the open-work hold and the auto-on
work hold both offer it with `--pid=` and `--agent=`; so do `journal next` and the skill's
hold table.

And it is asserted, in both arms of the start block and in the hold text, because this is
the same failure as a line-count cap that no test measures — a thing documented as true
with nothing holding it true.

## 1.24.1 — the environments noun answers to `env`

`journal env` is `journal environments`, and so are `envs`, `environment`, `tracks` and
`track`. `environments` stays canonical (ruling R10) and every other spelling is a
permanent alias, never printed as deprecated — `--env=<name>` already spelled it short as a
flag, so the noun answering to the same word is the consistent thing.

The four places that listed those spellings inline are one constant now, `ENV_NOUNS`. Four
copies of a list is three chances to forget an alias, and the fifth site would have been
the one that did.

Two assertions in test_tracks.py flipped, and correctly: they held `journal environment
help` to REFUSING, because that spelling dispatched nowhere. It dispatches now, so it must
answer — the "help answers exactly what runs" rule, working in the direction that adds.

## 1.24.0 — a name that is also a verb

Every noun's READ is an explicit verb: `journal tools show <name>`, `journal docs show
<doc>`, `journal environments show "<name>"`, beside the `list` each noun already answers.
The bare spellings — `journal tools <name>`, `journal docs 2`, `journal environments
"<name>"` — all still run, as ruling R3 requires; `show` is the one that always works.

BECAUSE A TOOL CAN BE CALLED `add`. Reading one by putting its name where a verb goes is
fine until somebody catalogues a tool named after a verb, and then the noun's own
vocabulary eats it: `journal tools add` is the add verb, forever, and there is no way to
say "the tool called add". Proved with tools named add, run, index, list, show, strike and
set, and a doc named search — each unreachable before this, each readable now, and
`journal tools run run` runs the one called run.

AND A VERB WITH ITS ARGUMENT MISSING IS AN ERROR, NEVER A PAYLOAD. Found while probing the
same seam: `journal todos show` with no number fell past the check and was read as a TITLE.
It filed a to-do called "show" and reported success. A write that lands wrong while saying
it went right is the one shape this package exists to prevent. It refuses now, and so does
`journal environments show` with no name.

## 1.23.0 — one pattern for every command: `journal <noun> <verb> [<id>] [<payload>]`

AN ENVIRONMENT CAN BE CLAIMED. `journal claim "<name>" "<why>"` takes one a live session
still holds. The guard that refuses a second session on an environment is right almost
always and useless in the one case it is reached for — the holder is gone, a closed
terminal or a crashed session, and the work is not — where the only ways past were to wait
out `session_stale_hours` or to turn the guard off for every environment at once. A guard
whose only override is global is a guard people turn off.

A claim is an EVICTION, never co-tenancy: the holder is unbound, because two sessions on
one environment is the exact thing the guard exists to prevent. The evicted session is
TOLD — the reason lands on its runtime and its next stop reads it out, naming who took the
environment and why, and how to claim it back. Nothing is deleted; the pins, work and
to-dos are untouched. The reason is required, for the same reason `strike` requires one: a
takeover with no reason on the record is indistinguishable from a bug, and the session that
lost the environment is owed the sentence. Every claim is kept on the record — who, from
whom, when, why.

That fixed a wrong explanation, too. An evicted session is unbound, so it fell into the
registered-nowhere path, whose whole story is "the environment you START on is held by
somebody else" — true of the start environment and no answer at all to what happened. A
wrong cause is worse than none: the reader switches somewhere else and never learns its
work moved.

THE ENVIRONMENTS NOUN TAKES ITS VERBS. `journal environments switch|claim|prepare|delegate|
handoff` are twins of the top-level spellings, which ruling R11 keeps because they are
burned into hook.py, handoff.default.md and every generated handoff.md. Top-level was never
meant to be the only spelling: a reader who learned `journal todos start` and `journal pins
add` looks for `journal environments switch`, and finding nothing there is the
inconsistency this whole release exists to end.

Every command now takes its arguments the same way, and names what it does the same way.
Nouns are plural — `pins`, `rules`, `docs`, `tools`, `todo`/`todos` (twins, either
spelling) — and every mutating action has an explicit verb: `add`, `strike`, `promote`,
`list`, `show`, plus each noun's own lifecycle verbs. `strike` is the one word for
retiring anything, everywhere: a struck pin, a repealed rule, a dropped to-do, a removed
tool. The old spellings still work — `journal pin "<x>"`, `journal remember "<x>"`,
`journal rule "<x>"`, `journal rule --strike N "<why>"`, bare `journal strike N "<why>"`,
bare `journal promote N`, `journal todo drop N "<why>"`, `journal tools remove <name>
"<why>"` — calling the exact same function their new alias calls, so the two spellings
can never drift apart; none of them is printed as deprecated. `switch`, `prepare`,
`delegate`, `handoff` and `search` stay top-level verbs, not wrapped under an
`environments` noun — they are lifecycle actions, not collection CRUD.

A to-do's brief can be changed instead of rewritten by hand: `journal todos amend <n>
"<section title>" --brief` appends a new `## <title>` section from stdin; `journal todos
replace <n> ["<section title>"] --brief` swaps one named section, or the whole brief with
no title given. The old text is always kept, copied whole to struck/ before the rewrite.
This needed `todo.show` to stop collapsing an indented list or a `## ` heading into
run-on prose — it renders with `fmt.block` now, the same renderer the hook already used.

Five listings that grew without a cap now have the one `docs.carry`/`tools.carry`
already used: a bare `journal docs`/`tools`/`todo`/`pins`/`rules` shows 15 and says
"… and N more; `--page=2` shows the rest." A single item, a search result, and
`journal environments "<name>"` — the page a runner picks work up from — are never
capped; the cut targets a description or a listing, never a payload. The SessionStart
block taught the retired `journal start`/`update`/`end` spelling in the one place every
session actually learns from; it teaches `journal work start`/`update`/`end` now, and is
shorter besides — one line of tags, with what each means in the `journal` skill. The
unbound-session opening from 1.19.0 is untouched: a session that has taken no environment
is still told so, in the same block.

THE PLURAL IS TAUGHT FIRST, everywhere. Ruling R10 made plural nouns canonical, and the
run that implemented it left `journal.py`'s synopsis and `commands.md` headlining the
singular with the plural as a footnote while `SKILL.md` did the reverse — two shipped
files teaching opposite orders. Every surface now leads with the canonical spelling and
names the singular as a permanent alias.

AND THREE DEFECTS FOUND BY WATCHING A RUNNER WORK. The session that DISPATCHES a runner is
no longer nudged to work the same list: `handoff --run` turns auto on for the environment,
and the dispatching session stops too, so both actors were told to pick up the next to-do
and the record could not say which of them did what. A hold's details are read once —
`journal next` served a snapshot written at the stop that sent you there, so a loop firing
it every fifteen minutes went on offering to-dos that had been closed in between. And
`/.journal` lost its trailing slash in `.gitignore`, because the slash matches a directory
and a worktree's `.journal` is a SYMLINK: it showed as untracked in every worktree, and a
`git add -A` there would have committed a path on one machine.

Run `python3 install.py --check` before pulling. This entry carries the work that shipped
on the branch as 1.18.1, which forked from 1.18.0 while 1.19.0–1.22.0 landed on main; the
lineage is reconciled here, by hand, and there is no 1.18.1 to upgrade from.

## 1.22.0 — work that is waiting is not nudged

`journal work await "<what you wait on>"` marks open work as in flight on something the
agent cannot hurry — a subagent, a build, a review, a person — and the stop hold leaves
that piece alone. Measured on this project's own session: three consecutive stops were
held for work that was correctly open and simply waiting on a subagent, each costing an
update that said the same thing. A hold that fires while nothing can move is noise, and
noise is what teaches a reader to clear a hold without reading it.

NAME WHAT YOU WAIT ON. `--agent=<id>` for a dispatched subagent, `--pid=<n>` for a process.
A sentence is a claim nobody can check; an identifier is a fact the machine can. A pid is
watched with signal 0: when that process exits the wait is over at the very next stop
rather than burning its timeout, and the hold says it exited. An agent id cannot be tested
— nothing exposes a subagent's liveness to a hook — so it is recorded and named back in
the hold, which is what tells you which of three dispatches you are still waiting on.

IT ALWAYS EXPIRES, because a wait with no end is how work is abandoned quietly: the
awaited thing dies, nothing nudges, and the journal reads as busy forever. `--for=<minutes>`
overrides the 20-minute default, capped at two hours (`await_default_minutes`,
`await_max_minutes`). When it expires the hold returns FIRST and by name, saying what was
awaited and for how long, and offering the three ways out: `work update` what you know,
`work await` again, or `work end`. Any update or close ends a wait early — progress means
the waiting is over. When a loop or cron will wake the session, set `--for=` past its next
cycle so the wake-up arrives before the hold.

After updating: reload the journal skill.

## 1.21.0 — handing work over is its own skill, and a run works the list to its end

The hand-off is now a second skill, `journal-handoff`, installed beside `journal`.
Preparing an environment, `journal handoff` and its two prompts, the runner's worktree and
`journal delegate` moved into it whole; the `journal` skill keeps a pointer and loads it
before the first `prepare`, `handoff` or `delegate` of a session. A session that never
hands anything over no longer carries the procedure for doing so, and the half that says
which model to dispatch and what becomes of the runner's branch is now read at the moment
it is needed. `journal install` carries both skills; `skill/references/prepare.md` is gone
and is removed from installed copies by name.

`journal handoff "<name>" --run` now turns AUTO ON for the environment, and the command
does it rather than trusting the prompt to. A runner exists to work a list to its end;
with auto off its stop is not held for the next to-do, so it would stop and ask — which is
the conversation the session dispatched an agent to avoid. It stays on after `--off`;
`journal todo auto off` ends it when what is left is the user's to decide.

After updating: reload the journal skill, and note the new `journal-handoff` one.

## 1.20.0 — a hand-off's runner works in its own worktree

`journal handoff "<name>" --run` now says to dispatch the runner with its own worktree, so
two runs of two environments never edit one checkout. Only the runner: the hand-off agent
writes nothing but the journal, and the journal is shared by every worktree on purpose, so
isolating it would isolate nothing. The runner's `.journal` is a symlink to the main
checkout's — that is what `worktree.py` has always done — so one record survives many
trees, and the runner's pins and to-dos reach the session that dispatched it.

The runner commits as it goes, because work left uncommitted in a worktree is work nobody
can reach, and it hands back a BRANCH. What becomes of that is the session's to settle:
tell the user what is on the branch and offer the merge. When the user has already asked
for the work to be merged, the session says so in the runner's prompt and the runner merges
when it is done; absent those words it does not merge, rebase or push at all.

Fixed, from 1.19.0: a session that had chosen no environment yet recorded the START
environment as "where it was" when it switched or handed off, because `current` falls back
there so that reads work unbound. `switch --back` and `handoff --off` then put it on an
environment it had never chosen — the one thing the unbound start exists to prevent. Where
it was is now NOWHERE for such a session: it returns unbound, and is told so. The same
fallback was making the one-session-per-environment check skip an unbound session, which
could bind it to an environment a live session already held; the check now asks about the
binding, not the fallback.

After updating: reload the journal skill. A project with its own `.journal/handoff.md` keeps
it — copy the runner section of the new `handoff.default.md` if you want the worktree wording.

## 1.19.0 — a new session has no environment until it chooses one

A session used to be bound at its start to the project's start environment — one it had
never been asked about — so its pins, to-dos and work landed there because nothing had
asked. Now it starts on none. The user is shown one line at the start saying so and
naming the environments that exist; the agent is told the same, on the start block and
again on every prompt while it stands, with the instruction to take an environment from
what the user just asked and say in one line which it took, or to ask when the message
names nothing to work on. Reads work unbound. Every write is refused, naming the way out,
so nothing can land in an environment nobody chose.

The old behaviour is one setting: `bind_on_start: true` binds a new session to the start
environment as before. An unbound session holds no environment, so a second session is no
longer told the start one is taken before anybody has taken it; `switch` still refuses one
a live session holds. Subagents are untouched — a delegated one is put on its environment
by the session that dispatched it, and an undelegated one is outside all of this.

After updating: reload the journal skill.

## 1.18.0 — tracks are environments

What was called a track is an environment: a session is bound to one, `journal
environments` lists them, `journal switch "<name>"` moves between them, and
`journal --env=<name> <command>` runs any command on a named one without switching. The
old spellings still work — `journal tracks`, `--track=`, `one_session_per_track`, the
`track` subject in `stop_priority` and `silenced` — and nothing on disk changes shape.

An environment can be prepared and handed off. `journal prepare "<name>"` creates one,
switches the session to it and prints what preparing means; the procedure — the source
whole, the brief as a doc, a Plan agent and a second agent for the steps, pins, one
to-do per unit of work — is in the skill and runs only when the user asks.
`journal environments "<name>"` is the pickup page. `journal delegate "<name>"` makes
the session and every subagent it dispatches act on that environment: a delegated
subagent journals there under the hooks — the write gate, the hints, a hold at its
SubagentStop for open work, the rules as its window fills — and may not switch,
delegate or prepare. Undelegated subagents stay outside, as before. The update wires
the SubagentStop event (the harness treats it as notification-only today; the write
gate is what holds a delegated subagent to the journal).

`journal handoff "<name>" "<source>"` has agents do all of it: it creates and delegates
the environment and prints one prompt; the agent dispatches that one hand-off subagent,
which fetches the source, writes the brief, runs its own planner and critic, pins,
writes the to-dos and validates the page, then reports READY; `--run` prints the
runner's prompt for the second dispatch. What a hand-off means is `.journal/handoff.md`,
the project's copy of the shipped `handoff.default.md`, never touched by an update.

After updating: reload the journal skill.

## 1.17.1 — the cross-checkout lookup is for session ids only

Only a real session id (a UUID) is looked for across every project folder; a subagent's
`agent-…` name or a fixture's stem would have found a stale namesake elsewhere. The
suites are green on the 1.17.0 defaults.

After updating: nothing.

## 1.17.0 — worktrees find their session, and context never gates

A session that moved into a worktree keeps its transcript under the checkout it started
in; `journal nothing` there found no transcript, filed nothing, and the hook went on
denying every call. A session's transcript is now found wherever Claude Code keeps it,
and a decision that cannot be filed says so instead of "no pin is due".

The context window defaults to 1,000,000 and the context rung never gates a tool call by
default: it is a hold at the stop, once per turn, answered with `pin` or `nothing`.
`gate_after_context_rung: true` brings the gate back. `journal verify` reports the
window the hook actually uses. A hold no longer repeats its label in its body.

After updating: nothing.

## 1.16.1 — one way out for every line

Everything a command prints passes through one function, and everything the hook hands
the harness through one other, so the house style is enforced in one place: errors are
one marked line, long paragraphs wrap, shaped lines — columns, commands, the hook's
one-liners — are kept as they are. `docs <doc> files` and the attachments of `docs
<doc>` are a columned table: name, what it is, kind and age, path, a folder's files
indented under it.

After updating: nothing.

## 1.16.0 — a hint to attach what keeps being read

A file that is not source — no source extension, not tracked by git; outside the
project, anything that is not source — read twice in one session earns a hint, once per
file, to attach it to the doc it belongs to. A design's rendered HTML, an export, a PDF
the user sent, a log. Source files (.vue, .blade.php, .py, tracked .html…) are never
hinted. `attach_hint_reads` sets the count; `attach_hint` in `silenced` turns it off.

After updating: reload the journal skill.

## 1.15.1 — one word for a doc

Every command listing says `<doc>` where a doc's number or name goes, and `<doc>.<p>`
for a part, in the synopsis, the skill, the reference and the README alike; `<name>.<p>`
resolves too.

After updating: reload the journal skill.

## 1.15.0 — attachments, and docs by name

A doc holds files as well as parts: `journal docs attach <doc> <path> "<what it is>"`
copies a file or a whole folder into the doc's files/ and lists it with one line saying
what it is; `journal docs <doc> files` shows them as a tree, `journal docs files` every
doc's; `detach` keeps the file under struck/ with the reason. Attachments are found by
`docs search` by name and by what they are, files inside a folder too, and the catalogue
and the start block count them. A file copied in by hand is adopted by `docs index`.

A doc is referenced by name as well as number, everywhere: `journal docs reactivity`,
`docs attach reactivity …`, `--doc=reactivity`. The title, case-insensitive, or a unique
part of it; a citation is stored as the number, so a renamed doc keeps what cites it.

After updating: reload the journal skill.

## 1.14.2 — the skill's start section knows about tracks

The skill says what the start block names — the track this session is bound to — and
what to do when it leads with a taken track.

After updating: reload the journal skill.

## 1.14.1 — a citation names its doc

A pin, rule or to-do that cites a part showed the part's title alone; it shows
"→ doc 1.4: <doc> · <part>" now, in listings and in the start block. `--doc=N` and
`--doc=N.P` are taught where the pin is: the skill's pin section, the synopsis, the
status page and the docs catalogue. The track rule is tested to leave subagents alone.

After updating: reload the journal skill.

## 1.14.0 — a prioritized queue, the loop first, one session per track

The stop queue's subjects carry a priority: track 5, loop 10, context 20, deferral 30,
untagged 40, work 50, auto 60, lowest first, and `stop_priority` in settings.json
reorders them per project. New at the head: with auto on and something to do, a session
without a loop is asked to start one before anything else (`journal loop set` when one
runs that the hook cannot see). A hold is one printed line now, not two.

One running session works a track. A second session that starts on a taken track is
told at its start by whom, held at its stops and refused edits until it has switched;
a switch onto a taken track is refused. A SessionEnd frees the track; a session not seen
for `session_stale_hours` (24) counts as gone. `journal tracks` says who is running.
`one_session_per_track: false` switches the rule off.

After updating: reload the journal skill. With auto on, make sure a loop is running.

## 1.13.0 — sessions are bound to tracks

Two sessions can work two tracks of one project at once. A session is bound to the
project's start track when it starts; `journal switch` from inside a session moves that
session only, `--project` also moves where new sessions start; from a terminal a switch
is always the project's, and it lists the sessions bound elsewhere with how to move one
(`--session=<id>`, `--all-sessions`). Pins and work now live under their track's name in
the record with `current` as a pointer; an old record is moved on first read.

After updating: nothing.

## 1.12.0 — the stop queue

Stop holds are a queue the hook runs one by one: context, deferral, untagged message,
open work, auto — one subject per stop, each at most once per turn, each pending until
its condition is actually resolved. One reply no longer clears three, and nothing can
loop. After a resolved context decision the same turn raises "auto is on, pick up the
next to-do".

After updating: nothing.

## 1.11.2 — the loop is said where auto is explained

The skill's to-do section says that auto mode means keeping a loop running (`loop`
skill, `15m journal next`), and the 1.6.0 entry now says to start it. An agent had read
both places it was documented and acted on neither; it told us why.

After updating: with auto on, start the loop if none is running.

## 1.11.1 — the package's own journal is not part of the package

agent-journal is now developed in its own repository, which keeps its own `.journal/`;
pulls skip it. Nothing to do after updating.

## 1.11.0 — worktrees share the journal; no update-check cache

In a linked git worktree the checked-out copy of `.journal/` becomes a symlink to the
main checkout's at session start, so every worktree reads and writes one record. A copy
with local changes is not deleted: the main journal is used and `journal worktree link`
replaces the copy when you say so.

Nothing to do after updating.

## 1.10.0 — holds form a queue; the update check is hourly

A hold stays pending until its condition is resolved — the message tagged, the context
decision made, the work noted or ended — and the next condition is raised only after,
so one reply no longer clears three. At most three holds per turn, so nothing loops.
The update check asks the repository every time; the cached answer is used only when
the network is down.

After updating: reload the `journal` skill.

## 1.9.0 — `journal pin`

A pin is written with `journal pin "<claim>"`, the same word everything else uses.
`journal remember` still works.

After updating: reload the `journal` skill.

## 1.8.0 — tool-shaped work is noticed; reload the skill after an update

A script written into a scratch or scripts folder, the same long inline script run twice,
or a scratch script run by name earns a one-time hint to catalogue it as a tool. After an
update the agent is told to reload the journal skill.

After updating: reload the `journal` skill.

## 1.7.0 — tools

Scripts the agent keeps for repeated work, catalogued under `.journal/tools/<name>/` with
a `tool.md` (title, summary, usage, when, entry point) and run with `journal tools run
<name> …`. Every session is handed the catalogue. `journal tools index` adopts folders
already there; `--entry` can point at a script anywhere in the project.

After updating: catalogue the scripts you already have.

## 1.6.0 — one-line holds, `journal next`, and a loop for auto mode

Every hold at a stop is one line; anything longer is behind `journal next`, which the
line names. With auto on, the agent is asked to keep a loop running that prompts
`journal next` every `auto_loop_minutes` (default 15), so an idle session comes back and
carries on until nothing is left it can do. The auto texts say "auto mode is on" rather
than "the user is away".

After updating: with auto on, start the loop — the `loop` skill with `15m journal next`.

## 1.5.2 — two fixes from a multi-repo workspace

`install.py --alias` removes the alias 1.3.x wrote into your shell rc, which shadowed the
new launcher and kept `journal` broken; an alias it did not write is named so you can
delete it. The gates read `python3 .journal/journal.py …` as the journal, so a context
warning can be answered in that form too.

After updating: run `.journal/install.py --alias` once, then open a new terminal.

## 1.5.1 — the `journal` command works without git

It finds the project by walking up to the nearest `.journal/`. Run `.journal/install.py
--alias` once to get the new launcher.

## 1.5.0 — `journal work start|update|end`; `journal update` updates the journal

The work commands are a family: `journal work start "…"`, `journal work update "…"`,
`journal work end "…"`. That frees `journal update` to mean updating the journal itself
(`journal upgrade` still works). The old `journal start` and `journal end` keep working;
`journal update "<text>"` now tells you to use `work update`.

After updating: use `journal work update` for notes on the open work.

## 1.4.0 — a `journal` command for every shell

`--alias` now installs a `journal` script in ~/.local/bin instead of a zsh/bash alias, so
it works in any shell; the installer says the one PATH line to add if needed. The README
explains the tags that appear at the start of the agent's messages.

After upgrading: run `.journal/install.py --alias` once to get the command; the old alias
in your shell rc keeps working and can be removed.

## 1.3.2 — a short install

The installer prints what it changed, "Installed.", and the one next step. Nothing to do after upgrading.

## 1.3.1 — install ends with next steps

The installer no longer runs checks that cannot pass before Claude Code has started; it
says what it wired and what to do next. `journal verify` from a plain terminal reports
"not fired yet" and "window not yet known" as facts, not failures.

Nothing to do after upgrading.

## 1.3.0 — the context window is learned

No setting needed: the window is learned at the first compaction (the peak before it is
the window) or from the session's peak once it rules out every window but one. The
`context_window` setting is an override. The README gained a settings section.

Nothing to do after upgrading; a `context_window` you set still wins.

## 1.2.3 — README commands, two columns again

Nothing to do after upgrading.

## 1.2.2 — README wording

How it works says the transcript is Claude Code's default behaviour, built on rather than replaced. Nothing to do after upgrading.

## 1.2.1 — README commands

One command per line with its meaning beneath; agent-only commands marked. Nothing to do after upgrading.

## 1.2.0 — docs live in .journal/docs

The catalogue's folder is `.journal/docs/` by default, beside the record and the to-dos,
so everything the journal keeps is in one place. A project that keeps its docs elsewhere
sets `docs_dir` in `.journal/settings.json`. Pulls never touch a project's docs.

After upgrading: if you had catalogued docs under `docs/`, move them to `.journal/docs/`
or set `"docs_dir": "docs"`.

## 1.1.6 — README: how does it work

A section at the bottom on the transcript, tags, line numbers, tracks, compaction and the hooks. Nothing to do after upgrading.

## 1.1.5 — README wording

The commands section opens with who runs what and nothing else. Nothing to do after upgrading.

## 1.1.4 — README features as headings

Each feature in the README has its own small heading. Nothing to do after upgrading.

## 1.1.3 — holds are one line; the README rewritten

Every hold at a stop now carries only its one-line instruction; the reasoning is in the
skill's hold table. Only the context warning keeps its text, because that text is what the
agent decides with. The README is rewritten: what it is, what it does, install, features,
commands — with the commands you run and the agent runs told apart.

Nothing to do after upgrading.

## 1.1.2 — a pull from a URL no longer copies the clone's .git

Upgrading from the repository copied the clone's `.git` folder into `.journal/`, a nested
repository nobody wanted. It is excluded. If you upgraded on 1.1.1, `rm -rf .journal/.git`.

## 1.1.1 — a pull no longer runs the test suites

`journal upgrade` and `install.py --from` copy the package and stop. The suites ran in a
staging directory before every pull and cost minutes per upgrade; they run where the
package is developed now. `install.py --from <src> --test` runs them if you want.

Nothing to do after upgrading.

## 1.1.0 — the README, and a fix to `install.py --from <url>`

The package now ships its README: what the journal is, how to install it in one line,
every command with what it does, and how it holds the agent to the rules. Read it once;
it is the human-readable version of the skill.

`install.py --from` takes a git URL as well as a path (1.0.0 folded the URL into a path).
`journal upgrade` was unaffected.

Nothing to do after upgrading.

## 1.0.0 — the first public release

The journal as it stands: tags on every message, declared work with a gate on writes,
pins and rules, to-dos with `ask`, `answer` and `auto`, a docs catalogue over `docs/`,
tracks, the context ladder that forces a decision, search across a track's sessions, and
`verify` that tells wired from fired.

Nothing to do after installing: `.journal/install.py --alias` wires the hooks and the
skill; `journal verify` says whether it is live.
