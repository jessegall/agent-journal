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
| Pre tool use | messages.unread_held: "you have N unread messages" | a message unread; every 3rd tool use since it came; 5 namings gone by; the tool writes | hold the tool, else say | the Always workflows Hold a write while messages stay unread after N reminders and Name the unread messages every N tool uses, on the agent's own tool use; the uses and reminders are read from the record |
| Pre tool use | messages.answer / answer_held: "answer message N before you do anything else" | a message read and unanswered; the tool is not a journal command; the tool does not read the message's own files | hold the tool (after `messages.hold_after`), say before | the Always workflows Hold the tools while a read message stays unanswered and Ask for an answer to a read message after N tool uses, on the agent's own tool use |
| Pre tool use | messages.whole: "read the user's words whole" | the command pipes a message or question read | hold the tool | stays in code: a shell-syntax guard, with the mixed-journal and narrow-read refusals |
| Pre tool use | secrets.kept_out: "the secrets and the MCP keys in the private folder are out of your reach" | the tool names the secrets folder or the keys folder, or a path resolving into either | hold the tool | stays in code: the engine keeps secrets safe, a tripwire no user would want to shape |
| Secret updated | secrets.allowed: "the user let secret N go to a program" | the user allowed a program | say | stays in code: the engine delivers the user's word, as it does a plan's approval |
| Pre tool use | tasks.log_soon / in_hand / log_overdue | a task in hand; edits since the log at, every and over the three settings; the tool writes | say, say, hold | Working's three workflows at Pre tool use: hold the write when the log is overdue, ask after N edits, name the task every N edits; the edits since the log are read from the record |
| Pre tool use | tasks.polling: "you ran the same check N times in a row" | the same shell command three times running | say | the engine's: the tasks feature's SpotPolling listener, ruled engine behaviour (plan 7, task 393) |
| Pre tool use | shell.reader_tip: "you read outputs this way again: X" | the same hand-written read of an output, whichever output, twice among the last 25 reads of the session; once per shape | say | the engine's: the shell feature's SpotHandReads listener, the user's ruling (messages 4790, 4797, 4810) |
| Pre tool use | shell.use_reader: "reader X already reads this: Y" | a hand-written read of an output that holds the pattern of one of the project's readers; once per reader | say | the engine's: the shell feature's SpotHandReads listener, the user's ruling (message 4861) |
| Pre tool use | laws.no_model / no_profile / no_job | the tool dispatches a subagent; the dispatch names no model, no profile of the project (a generic agent such as general-purpose is none) or no job | hold | stays in code: a law of the journal, L1 and L2, which no workflow may switch off |
| Pre tool use | questions.own_tool | the tool is the agent's own question tool | hold | stays in code: a guard on the provider's own tool, as the shell guards are |
| Pre tool use | shell.alone | a journal command chained with other commands | hold | stays in code: a shell-syntax guard |
| Pre tool use | shell.narrow | a whole read of a file over twice the shown lines | hold | stays in code: a shell-syntax guard |
| Pre tool use | triggers.denied | a trigger of the user's matches the tool | hold | stays with the triggers feature: the user's own watch words are conduct of their own kind, edited on their page |
| Post tool use | laws.large_result | the result ran over N lines | say | stays in code: a law of the journal, L3 |
| Post tool use | git.closed_by_commit | a commit's message named tasks | say | stays with the git feature: it reads commit messages, which no check reads |
| User prompt submit | messages.new / some / many | messages unread, by count | say | the Always workflow Say what is unread at User prompt submit |
| User prompt submit | skills.required | the prompt names a skill's keyword; the skill not read since | say, then hold the tool until read | in the workflow the Always workflow at User prompt submit (Require a skill, locked) and the hold in the guards at Pre tool use; the skill is owed as a link on the agent's row |
| Stop | tasks.carry_on / log_old | a task in hand; its log stale (10 min) | block the stop | Working's two workflows at Stop: tell the agent to carry on, and ask for a log when the task's log is old |
| Stop | plans.checkpoint / checkpoint_passed | a started plan at a completed checkpoint phase; auto mode | say, or hold the stop and carry on | in the workflow Following a plan; the plan's advance stops at the checkpoint in the plans feature, the agent standing in the plan's state |
| Stop | messages.new / some / many | messages unread | say on the stop | the Always workflow Say what is unread at Stop |
| Stop | tasks (chart): parked tasks, next task | at rest; parked tasks; auto mode; open tasks | block the stop | Idle's two workflows at Stop: hold the stop while a task is parked, and in auto mode while tasks are open; a held stop runs no later workflows |
| Stop | chart.awaiting: "you stopped while the journal awaits ..." | something owed: a skill, the look at what is in flight, a decision at a mark | block the stop, naming the debt | in the workflow the Always workflow at Stop (Something owed?, locked); the pause's own stop rule is deleted |
| Session start | briefing.ready, quiet, laws, takeover, rules, facts, reminders, waiting | always; the rows that exist; another session lately | say | the engine's: the briefing feature's StartBriefing listener says the start block after the look is owed, before any Session start workflow (task 842); the chart's checks and fillers of the same names read the same StartLines |
| Session start | messages.new / some / many | messages unread | say | the engine's delivery: the messages feature catches a starting session up on what is unread (DeliverUnreadAtStart), on the user's ruling of message 1672 |
| Session start | voices.voice | the voice chosen | say | the Always workflow Tell the agent how to talk to the user at Session start, with the filler {{voice}} (plan 7, task 396); its listener is deleted |
| Session start | voices.introduce | a fresh conversation | type, after a delay | stays with the voices feature: a typed line after a delay, which no node does |
| Tick | tasks.check_in: "nothing has happened for half an hour" | auto mode; idle; quiet for 30 min | say | in Idle's workflows; its listener is deleted |
| Tick | tasks.parked_still: "task N is still parked: can you continue it now?" | idle; a parked task; now and then | say | in Idle's workflows; its listener is deleted |
| Tick | tasks.check_awaited: "check X now: you have waited N min" | waiting on something; quiet for 5 min | say | Expecting's workflow at Tick, Remind the agent what it waits for after five minutes of quiet |
| Tick | delivery retype | a typed line unconfirmed for 10 s between turns | type again | stays in the engine: delivery |
| Message created by the user | messages.new: "new message N" | the author is the user; a live agent | type | the engine's own delivery: the messages feature's DeliverMessage listener types it and starts the counts; not a workflow, since nobody would open a canvas to decide whether the agent gets a message |
| Message created by the user | triggers (watch words) | the words match a trigger | say or start a sequence | stays with the triggers feature, as above |
| Reaction created by the user | messages.reacted | a face on a message | type | the engine's delivery: the messages feature's TellReaction listener tells the agent of a reaction you put on its message |
| Rule created | memory.rule_review | a new rule | type once | stays with the memory feature: ReviewNewRule asks once about a rule the agent just made |
| Message by the agent created | etiquette.remind | now and then | type | the Always workflow at Post tool use, Remind the agent what a journal line is every N lines, on the agent's own tool use, reading the lines said since the last reminder (plan 7, task 397); its listener is deleted |
| Tool about to run | workers.not_yours: "that file is in worker N's worktree" | the agent writes inside a worker's worktree | refuse | stays with the workers feature: KeepOutOfWorkerWorktrees keeps a worker's worktree its own |
| Tool about to run | workers.too_many_subagents: "N subagents are running, the most at once" | a subagent started while workers.most_subagents are running | refuse | stays with the workers feature: HoldPastMostSubagents |
| Command run | workers.too_many_workers: "N workers are out, the most at once" | a worker dispatched while workers.most_out are out | refuse | the worker command refuses it |
| Worker updated | workers.reported / stopped / returned | the worker reported or stopped; agents awaiting it; the last one back | say, release the wait | in Awaiting's workflow at Worker updated, which sends the agent back when the last worker is back; its listener is deleted |
| Question updated | questions.answered | the question answered; agents waiting on it | type, release the wait | in Waiting's workflow at Question updated, which sends the agent back; its listener is deleted |
| Plan updated | plans.approved, next, done, parked | the plan's state changed | type | the engine's: the plans feature's listeners tell the agent of a plan's approval and follow it from task to task, its own moves (plan 7, ruled with task 414) |
| Dump updated | dumps.arrived, carry_on | the user dropped items into the dump in hand and some are unread; the agent is idle with items to settle and no question waiting | type | the engine's: the dumps feature's listeners deliver the user's drop and keep a dump moving, one dump at a time |
| Dump updated | dumps.answered, chose, decide, filed | the user answered the agent's question, picked or left to the agent a next step, or the dump closed | type | the engine's: the dumps feature's listeners deliver the user's word, as a plan's approval is |
| Question or task updated | tasks.wait_cleared: "task N is open again: X is answered or closed" | a question answered or a task closed that a task waits on, with nothing else holding it | type | the engine's: the tasks feature's ClearWaits listener unblocks the waiting task and tells the live agent (plan 13) |
| Output or wait script updated | tasks.wait_over: "the wait for X is over: what each came to" | a command's output a wait names has ended, or its --until script passed, with nothing else it names still out | type | the engine's: the tasks feature's EndSettledWaits listener sends the agent back to what it was doing and tells it |
| Tool finished | messages.reply_by_tag: "a reply needs no command. type it in your turn with [!reply:N] opening its line" | the agent ran journal message send | context on that command's result | the engine's: the messages feature's HintReplyByTag listener; a hint on a command's result is never a workflow's |
| Task updated | plans.blocked: "plan N is blocked: all its tasks left are blocked" | every task a started plan has left is blocked | type | the engine's: the plans feature's BlockPlanOnItsTasks listener blocks the plan and tells the live agent |
| Task, question or check updated | plans.open_again: "plan N is open again: X" | a task of a plan that blocked itself opens, or what a blocked plan waits on is answered, closed or passed | type | the engine's: BlockPlanOnItsTasks or ClearPlanWaits opens the plan and tells the live agent |
| Setting saved | voices.changed | a voice setting changed | type | stays with the voices feature |
| Tool finished | pins.unpinned: "URL is not pinned" | a link in a tool's output that no pin carries, suggested again only after pins.suggest_every tool uses | tell | stays with the pins feature: UnpinnedLinkInOutput |
| Turn written | messages.only_a_face, messages.replied_already, messages.repeated_reply, etiquette shop_talk / third_person / dashes / paragraphs, pins.unpinned | the words of the turn | say | stays in code: reads the turn's words |
| Any event at a mark | memory.decide / held | context at 25, 50, 80 percent | say, hold | in every Always and Guards workflow at an agent event (Context over a mark not taken?, Hold the agent at a context mark, locked) and the write hold in the guards at Pre tool use; the mark owed is a fact on the agent's row, paid by fact, rule or nothing |
| Any event | memory.whisper | a fact, rule or reminder's keyword in the prompt | say | stays with the memory feature: it reads the keywords of facts, rules and reminders, which no check reads |

What stays in code by design, with why: delivery of a message and of typed lines, the shell runner's parts and limits
with its three refusals (a mixed journal chain, a whole read of a long file, a piped read of the user's words: each a
guard on shell syntax), the reading of the agent's turn for etiquette and faces, what the agent owes the journal (the
skills, the look, the mark), the moves the journal makes itself and the menu watcher. Every other line in the table
above is a workflow's to carry. Ruled under plan 3 (task 176) and closed in plan 7: each row's last cell says whether a workflow
carries it, by its title, or the engine keeps it, and why. No row waits for a later phase.

## Every state, and who holds its conduct

The conduct for every state is an Always workflow per event, after the locked guards; a state's own steps are its workflow at the trigger, found by the
state's class and then its parents, so following a plan takes Working's workflow and every wait takes its own
before Paused's. The event the Stop hook sends is keyed `idle` in the catalogue, where its title is Stop;
the state the agent rests in is also called idle, so the trial, the commands and the page name the event by its
title and the state by its name.

| State | Who holds its conduct | Why |
| --- | --- | --- |
| idle | Idle's workflows | the stop's holds, the parked ask and the check-in are conduct the user may change |
| working | Working's workflows | the log cadence and the task in hand's lines; following_plan inherits them |
| following_plan | Working's workflow, by inheritance | a plan being followed is a kind of working, with the plan's next task as its only addition |
| awaiting | Awaiting's workflows | a worker reporting or stopping, and Send the agent back to what it was doing when the last is back, are conduct |
| waiting | Waiting's workflows | a question answered, and Send the agent back to what it was doing, are conduct |
| paused | the engine's: the pausing feature's state, no workflow | the pause button on the plan bar moves the agent into it; its every tool call is refused with the pausing feature's line, and the resume button, or a word from the user, puts it back where it was; the resume tells it to carry on |
| sorting_dump | the engine's: the dumps feature's state, no workflow | a dump the user drops moves the agent into it; the stop is held until every item is filed or failed, save while the user's answer is awaited; the dump filed, the agent goes back where it was or on to the next dump |
| expecting | Expecting's workflows | the reminder of what it waits for, and Send the agent back when it uses a tool itself, are conduct; the wait itself is entered by Wait for something outside, named by its outcome |
| a wait while the agent owes the journal something | the wait's workflow | what the agent owes, a skill, the look at a start, a decision at a mark, is a fact on its row and never a state over the wait: a row event about a question or a worker reaches the wait itself, and the guards hold its writes until the debt is paid, which keeps standing |
| every wait above | the engine, as the way out | a word from the user frees any wait that is not the agent's own doing, ruled once in Paused; so a wait whose workflow was emptied or edited still ends, and the page warns when a wait's workflow releases nothing |
| a sequence running | the engine | a run is a fact on the agent's row, kept as a stack beside any state and carried to the next session; the step is said at a stop outside a wait, and starting, stepping and ending go through one funnel, so no workflow draws it |
| stuck | Stuck's workflows | the journal says nothing until the agent's own tool use sends it back; entered by Mark the agent stuck, named by its outcome; the shared conduct runs under it |
| orienting | a fact, held in the Always workflow | the look at what is in flight is a fact on the agent's row, marked by the Always workflow at Session start, held at a write by the guards and at a stop by the Always workflow at Stop, paid by journal environment here |
| at_mark | a fact, held in the Always workflow | the mark owed is a fact on the agent's row, taken by Hold the agent at a context mark in every Always and Guards workflow, held the same way, paid by fact, rule or nothing |
| loading_skill | a fact, held in the Always workflow | a skill owed is a link from the agent's row, set by Require a skill, held the same way, paid by the read of the file; an agent standing in one of the three at boot is unwrapped with its fact set, a user's workflow bound to one kept turned off and named |
| ended | the workflow No workflow for this state yet, its trigger alone | a session that ended says nothing; an hour's silence ending it is the engine's own move (plan 7, task 398) |

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
- A guard that raises fails open: the event goes through as if the guard had said nothing, and the fault is
  reported loudly, an entry of kind guard_failed, a card in the chat and a line to the agent (hooks/receiver);
  a hold is never the result of a fault, and the law text says so.
- What the agent owes the journal, each held by its own feature at a write and at a stop: the journal skill and
  a state's skill (skills: skills.required at a write, skills.stopped_owing at a stop), the look at what is in
  flight (briefing: briefing.orient, briefing.stopped_unoriented), a decision at a context mark (memory:
  memory.held, memory.stopped_at_mark); engine code, never a node.
- A menu in the agent's terminal (engine/menu_watcher, providers/menu): the supervisor mirrors the agent's newest
  output and the keyboard's last key; the watcher, a service of the journal's own, reads the mirror every second,
  recognises a menu by its shape and, once the screen is still, confirms one the journal's agent-bar pick caused,
  accepts the trust question for the launched folder, declines one that offers a no, and closes the rest with
  Escape, with a card in the chat each time; a menu opened from the keyboard or the viewer is left to the user.
  The supervisor only carries the keys and the bytes.
- The floor under every hold: a journal command and the read of a skill's file always run, whatever a workflow
  holds; the engine drops the refusal and keeps the words (chart/walk).
- A session's start: the journal skill and the look at what is in flight are owed by the Always workflow at
  Session start, as facts on the agent's row, and held by the guards until the read and `journal environment
  here`; the start block itself is the engine's, said by the briefing feature before any workflow (task 842).
- Skills forgotten at a compaction, so a start owes them again (skills); a state's skill is required by its own
  workflow at Session start, the ones a prompt names by the Always workflow at User prompt submit.
- A new rule questioned once (memory/review_new_rule); the context mark is the workflows' now, as a fact on the agent's row.
- A plan's advance and its approval (plans); a sequence's steps and its start on a row event (sequences); a
  question asked only through the journal (questions).
- The guards on how the agent works, ruled engine behaviour on 2026-10-17 (plan 7, tasks 388 to 393): the shell
  runner's parts, its limits and the move to the background past them; a journal command mixed with other shell
  on one line refused; a read piped into something refused; a long output cut and a whole file not read; a
  dispatch that names no model or no bounded job refused; the question tool held. None is a node, since nobody
  would open a canvas to change them or to watch them.
- Delivery of typed lines and their retyping (delivery), decided for good in plan 7 (task 399); the thought in
  the working bubble (thinking).
- The voice at a start and when changed (voices); the commit line that closes tasks (git); checks run on their
  interval (checks); an agent owed a restart after a server change (mcp); an hour's silence ending the session
  (briefing), the engine's own move, never a node (plan 7, task 398).

The walk itself: agent events walk the chart as a blocking listener right after the machine, so a hold or a
blocked stop reaches the agent and a said line rides on the hook's answer; row events walk on the worker thread
and only type. A path is at most fifty nodes long; a chart with a loop, a dangling line or an unknown entry is
refused before it is saved, so the walk never meets one.
