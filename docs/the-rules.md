# The rules: who carries each one

Every rule the journal applies to an agent, and whether a workflow carries it or the engine keeps it. "Workflow"
means a shipped workflow draws it, on the Workflows page, and the user can edit it; "locked workflow" means a shipped
one the user may read and add to but not delete, turn off, reword or gate, shown with a lock; "stays in code" means it is
part of the machine, a law of the journal or a guard on syntax or data, and no workflow may change it; "stays with
its feature" means a feature's own listener keeps it because it reads what no check reads. The listeners the
workflows replaced are deleted; the frozen replay records under tests/replays are the proof the workflows say the same.

The test for which side a rule belongs to is the one CLAUDE.md states: would a user ever want it different, or want
to watch it happen? Delivering a message to the agent fails it, so the engine does it; the reminder every third
tool use passes it, so a workflow carries it. Engine behaviour never appears on the Workflows page, not as a node
and not as a note. A shipped workflow is titled by what it does ("Keep the agent going while tasks are open or
parked"), and the line under it says when it runs.

## Carried by the chart

- At a stop, at rest: parked tasks hold the stop and are named, in any mode.
- At a stop, at rest, auto mode on and tasks open outside a plan: the next task holds the stop.

## Every line, by event

One row per line the journal says, holds or types: the event it fires on, the checks it needs, what it does, and
the workflow that carries it or why it stays in code. Numbers are the option
defaults as the code reads them: the log is asked after `tasks.first_nudge_after` edits (25), the task named every
`tasks.name_every` (25), the write held after `tasks.log_after` (50); a read message holds the next tool call after
`messages.hold_after` tool uses (0) and is asked for after `messages.nudge_after` (0); the unread inbox is named every
`messages.remind_every` tool uses (3) and the write held after `messages.hold_after_reminders` namings (5).

| Event | Line (nudge key) | Checks it needs | Action | Catalogue today |
| --- | --- | --- | --- | --- |
| Tool about to run | messages.unread_held: "you have N unread messages" | a message unread; every 3rd tool use since it came; 5 namings gone by; the tool writes | hold the tool, else say | in the locked workflow the guards at Tool about to run, on the counts of uses and namings; its listener is deleted |
| Tool about to run | messages.answer / answer_held: "answer message N before you do anything else" | a message read and unanswered; the tool is not a journal command; the tool does not read the message's own files | hold the tool (after `messages.hold_after`), say before | in the locked workflow the guards at Tool about to run, on the count of uses owed; its listener is deleted |
| Tool about to run | messages.whole: "read the user's words whole" | the command pipes a message or question read | hold the tool | stays in code: a shell-syntax guard, with the mixed-journal and narrow-read refusals |
| Tool about to run | tasks.log_soon / in_hand / log_overdue | a task in hand; edits since the log at, every and over the three settings; the tool writes | say, say, hold | in the workflow Working at Tool about to run, on the edits count the workflows keep; its listener is deleted |
| Tool about to run | tasks.polling: "you ran the same check N times in a row" | the same shell command three times running | say | a workflow in phase 3, in the base at a tool use, with the check same command N times running and the command filler |
| Tool about to run | laws.no_model / no_job | the tool dispatches a subagent; the dispatch names no model or no job | hold | stays in code: a law of the journal, L1 and L2, which no workflow may switch off |
| Tool about to run | questions.own_tool | the tool is the agent's own question tool | hold | stays in code: a guard on the provider's own tool, as the shell guards are |
| Tool about to run | shell.alone | a journal command chained with other commands | hold | stays in code: a shell-syntax guard |
| Tool about to run | shell.narrow | a whole read of a file over twice the shown lines | hold | stays in code: a shell-syntax guard |
| Tool about to run | triggers.denied | a trigger of the user's matches the tool | hold | stays with the triggers feature: the user's own watch words are conduct of their own kind, edited on their page |
| Tool finished | laws.large_result | the result ran over N lines | say | stays in code: a law of the journal, L3 |
| Tool finished | git.closed_by_commit | a commit's message named tasks | say | stays with the git feature: it reads commit messages, which no check reads |
| Prompt sent | messages.new / some / many | messages unread, by count | say | in the workflow the Always workflow at Prompt sent; its listener is deleted |
| Prompt sent | skills.required | the prompt names a skill's keyword; the skill not read since | say, then hold the tool until read | in the workflow the Always workflow at Prompt sent (Require a skill, locked) and the hold in the guards at Tool about to run; the skill is owed as a link on the agent's row |
| Agent stops | tasks.carry_on / carry_on_log | a task in hand; its log stale (10 min) | block the stop | the workflow Working at a stop, in phase 2 (task 162), with the frozen record of the Working rules as its proof |
| Agent stops | plans.checkpoint / checkpoint_passed | a started plan at a completed checkpoint phase; auto mode | say, or hold the stop and carry on | in the workflow Following a plan; the plan's advance stops at the checkpoint in the plans feature, the agent standing in the plan's state |
| Agent stops | messages.new / some / many | messages unread | say on the stop | in the workflow the Always workflow at Agent stops; its listener is deleted |
| Agent stops | tasks (chart): parked tasks, next task | at rest; parked tasks; auto mode; open tasks | block the stop | Idle's workflows, in phase 2 (task 161) |
| Agent stops | chart.awaiting: "you stopped while the journal awaits ..." | something owed: a skill, the look at what is in flight, a decision at a mark | block the stop, naming the debt | in the workflow the Always workflow at Agent stops (Something owed?, locked); the pause's own stop rule is deleted |
| Session starts | briefing.ready, rules, facts, reminders, waiting, laws, quiet, takeover, orient | always; the rows that exist | say, then hold until oriented | stays in the engine: the briefing |
| Session starts | messages.new / some / many | messages unread | say | in the workflow the Always workflow at Session starts; its listener is deleted |
| Session starts | voices.voice, introduce | the voice chosen; a fresh conversation | say | stays with the voices feature: the voice's own words |
| Clock ticks | tasks.check_in: "nothing has happened for half an hour" | auto mode; idle; quiet for 30 min | say | in Idle's workflows; its listener is deleted |
| Clock ticks | tasks.parked_still: "task N is still parked: can you continue it now?" | idle; a parked task; now and then | say | in Idle's workflows; its listener is deleted |
| Clock ticks | tasks.check_awaited: "check X now: you have waited N min" | waiting on something; quiet for 5 min | say | Expecting's workflows, in phase 2 (task 165), with the frozen record as its proof |
| Clock ticks | delivery retype | a typed line unconfirmed for 10 s between turns | type again | stays in the engine: delivery |
| Message created by the user | messages.new: "new message N" | the author is the user; a live agent | type | the engine's own delivery: the messages feature's DeliverMessage listener types it and starts the counts; not a workflow, since nobody would open a canvas to decide whether the agent gets a message |
| Message created by the user | triggers (watch words) | the words match a trigger | say or start a sequence | stays with the triggers feature, as above |
| Reaction created by the user | messages.reacted | a face on a message | type | a workflow later, in every state's on reactions.created, with the check reaction by the user and the face and message fillers |
| Rule created | memory.rule_review | a new rule | type once | a workflow later, in every state's on rules.created, with the rule filler |
| Message by the agent created | etiquette.remind | now and then | type | a workflow later, in every state's, with the check every N lines said; its flood of today is fixed at the source already |
| Worker updated | workers.reported / stopped / returned | the worker reported or stopped; agents awaiting it; the last one back | say, release the wait | in Awaiting's workflow at Worker updated, which sends the agent back when the last worker is back; its listener is deleted |
| Question updated | questions.answered | the question answered; agents waiting on it | type, release the wait | in Waiting's workflow at Question updated, which sends the agent back; its listener is deleted |
| Plan updated | plans.approved, next, done, parked | the plan's state changed | type | a workflow later, in every state's on plans.updated, with plan-state checks and fillers |
| Setting saved | voices.changed | a voice setting changed | type | stays with the voices feature |
| Turn written | messages.only_a_face, etiquette shop_talk / third_person / dashes / paragraphs, pins.unpinned | the words of the turn | say | stays in code: reads the turn's words |
| Any event at a mark | memory.decide / held | context at 25, 50, 80 percent | say, hold | in every Always and Guards workflow at an agent event (Context over a mark not taken?, Hold the agent at a context mark, locked) and the write hold in the guards at Tool about to run; the mark owed is a fact on the agent's row, paid by fact, rule or nothing |
| Any event | memory.whisper | a fact, rule or reminder's keyword in the prompt | say | stays with the memory feature: it reads the keywords of facts, rules and reminders, which no check reads |

What stays in code by design, with why: the briefing (a start is the engine's), delivery of typed lines, the shell runner's
parts and limits with its three refusals (a mixed journal chain, a whole read of a long file, a piped read of the
user's words: each a guard on shell syntax), the reading of the agent's turn for etiquette and faces, and the state
rules (carry on in hand, the awaited check) until each moves with its state. Every other line in the table above is
a workflow's to carry. Ruled under plan 3 (task 176): each row's last cell says which of three it is. A row that
says "stays in code" is a law of the journal or a guard on syntax, data or a provider's tool, which no workflow
may switch off; a row that "stays with" a feature is that feature's own conduct of another kind, the voice, the
watch words, the memory's keywords; a row that says "a workflow in phase 3" moves into every state's workflow once its
check is built, and the rows marked phase 2 move into their state's workflow with the frozen records as proof.

## Every state, and who holds its conduct

The conduct for every state is an Always workflow per event, after the locked guards; a state's own steps are its workflow at the trigger, found by the
state's class and then its parents, so following a plan takes Working's workflow and every wait takes its own
before Paused's. The event the Stop hook sends is keyed `idle` in the catalogue, where its title is Agent stops;
the state the agent rests in is also called idle, so the trial, the commands and the page name the event by its
title and the state by its name.

| State | Who holds its conduct | Why |
| --- | --- | --- |
| idle | Idle's workflows | the stop's holds, the parked ask and the check-in are conduct the user may change |
| working | Working's workflows | the log cadence and the task in hand's lines; following_plan inherits them |
| following_plan | Working's workflow, by inheritance | a plan being followed is a kind of working, with the plan's next task as its only addition |
| awaiting | Awaiting's workflows | a worker reporting or stopping, and Send the agent back to what it was doing when the last is back, are conduct |
| waiting | Waiting's workflows | a question answered, and Send the agent back to what it was doing, are conduct |
| expecting | Expecting's workflows | the reminder of what it waits for, and Send the agent back when it uses a tool itself, are conduct; the wait itself is entered by Wait for something outside, named by its outcome |
| a wait while the agent owes the journal something | the wait's workflow | what the agent owes, a skill, the look at a start, a decision at a mark, is a fact on its row and never a state over the wait: a row event about a question or a worker reaches the wait itself, and the guards hold its writes until the debt is paid, which keeps standing |
| every wait above | the engine, as the way out | a word from the user frees any wait that is not the agent's own doing, ruled once in Paused; so a wait whose workflow was emptied or edited still ends, and the page warns when a wait's workflow releases nothing |
| running_sequence | Running a sequence's workflows | the step held at a stop is conduct; the stepping stays the state's move |
| stuck | Stuck's workflows | the journal says nothing until the agent's own tool use sends it back; entered by Mark the agent stuck, named by its outcome; the shared conduct runs under it |
| orienting | a fact, held in the Always workflow | the look at what is in flight is a fact on the agent's row, marked by the Always workflow at Session starts, held at a write by the guards and at a stop by the Always workflow at Agent stops, paid by journal environment here |
| at_mark | a fact, held in the Always workflow | the mark owed is a fact on the agent's row, taken by Hold the agent at a context mark in every Always and Guards workflow, held the same way, paid by fact, rule or nothing |
| loading_skill | a fact, held in the Always workflow | a skill owed is a link from the agent's row, set by Require a skill, held the same way, paid by the read of the file; an agent standing in one of the three at boot is unwrapped with its fact set, a user's workflow bound to one kept turned off and named |
| ended | the workflow Does nothing yet, its trigger alone | a session that ended says nothing; its end and its start move into the workflows in phase six (task 398) |

A state not in this table does not exist: the subagent state nothing ever entered is gone. A state change a workflow
makes is named by its outcome, Wait for something outside, Mark the agent stuck, Change state to Idle, Send the agent
back to what it was doing; one move per event, the first to act, and a second is refused and recorded. A change to
Idle from a state that owns something is refused, and no node enters a state that owns a row.

## Kept in code, by design

- The engine's own moves: a task started moves the agent to Working and back when it is done or parked, a plan
  followed from its task, a question asked makes it wait, a worker dispatched makes it await, a sequence runs from
  its first step, a prompt frees a wait, a session's end ends its work; none is a workflow and none is shown as one.
- Delivery of a message to the agent: typed by number and the reminder counts started (messages/deliver_message),
  the owed count started at the first message read and left unanswered (messages/start_owed_count).
- The floor under every hold: a journal command and the read of a skill's file always run, whatever a workflow
  holds; the engine drops the refusal and keeps the words (chart/walk).
- A session's start: the briefing (briefing); the journal skill and the look at what is in flight are owed by
  the workflow the Always workflow at Session starts, as facts on the agent's row, and held by the guards until the read and
  `journal environment here`.
- Skills forgotten at a compaction, so a start owes them again (skills); a state's skill is required by its own
  workflow at Session starts, the ones a prompt names by the Always workflow at Prompt sent.
- A new rule questioned once (memory/review_new_rule); the context mark is the workflows' now, as a fact on the agent's row.
- A plan's advance and its approval (plans); a sequence's steps and its start on a row event (sequences); a
  question asked only through the journal (questions).
- The shell runner's parts, limits and the mixed-journal refusal; a long file not read whole (shell).
- Delivery of typed lines and their retyping (delivery); the thought in the working bubble (thinking).
- The voice at a start and when changed (voices); the commit line that closes tasks (git); checks run on their
  interval (checks); an agent owed a restart after a server change (mcp); silent sessions ended (briefing).

The walk itself: agent events walk the chart as a blocking listener right after the machine, so a hold or a
blocked stop reaches the agent and a said line rides on the hook's answer; row events walk on the worker thread
and only type. A path is at most fifty nodes long; a chart with a loop, a dangling line or an unknown entry is
refused before it is saved, so the walk never meets one.
