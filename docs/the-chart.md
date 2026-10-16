# The chart: the journal's conduct, drawn

The Workflow page shows how the journal treats the agent as a flowchart, and lets you change it. A workflow is bound
to a state at an event and holds that one trigger: one workflow per state per trigger, picked by the state and then
the event, and each carries the shared conduct of its event, the inbox and the answers owed, as well as the state's
own. Workflows of the older shape, bound to one event each, answer by their event until they retire: a journal holds one such workflow
per event, each starting at its event's trigger; a second on the same event is refused, since two would both drive
the agent, and should a journal somehow hold two, the older one answers and the page marks the other sidelined. The journal ships it with today's conduct, so nothing changes until you edit it.

The walk reads the agent's state once, right after the engine's machine has answered the event and before the engine's
holds, and every check and filler reads that same state; so a tool use that lifts a wait is walked as Working, and a
session start is walked as the state the agent resumes in, before the briefing's hold takes it. A release or a move inside the walk hands the event on to the new state's workflow, once, so a tool use that lifts a wait is walked as working too. The trace of a walk names the state it ended in and the workflows it ran, in the order they run: the
workflow of the agent's state or of the nearest state it inherits from, following a plan being a kind of working and
every wait a kind of pause, then a workflow of the older shape that answers the event by itself.

A workflow may move the agent, through the engine's machine: a release sends a paused agent back to what it was
doing; a move to idle is allowed from a state that owns nothing; and a move into expecting or stuck lays that wait
over what the agent is doing, with the words after the state's name as what it waits for, so a workflow can make
the agent wait on something outside. A state that owns a row, working, following a plan, waiting on a question,
awaiting a worker, running a sequence, is entered by what makes that row, and a move there is refused with the
reason, before the save and on the walk.

A trial, `journal chart try <event>`, walks the workflows dry and says the path and what it would do, nothing done; it
walks as the live agent, or as the state given with `--state`, with the agent's own data when it is in that state, and as
a `--provider` whose tool names the tool event takes; `--quiet`, `--edits` and `--unread` lay a state over the live rows,
and the trial says everything it assumed.

Each workflow is compiled once into a graph in memory and walked from there; a write to any workflow through the
journal clears the compiled graphs, so the next walk reads the edit.

## The shipped workflows

Every state has a workflow at each of the shared events, carrying the shared conduct: a message arriving is typed to
the agent; the inbox named at a start, a prompt and a stop; the unread inbox named every so many tool uses and the
write held after so many namings; a read message answered before the next tool, held after so many uses. And each
state adds its own, at its own events:

- **Idle**: at a stop, parked tasks hold it in any mode and the next open task in auto mode; as the clock ticks, the
  parked ask after a minute and the check-in after half an hour.
- **Working**: the task in hand named back every so many edits, the log asked for and then held; carry on at a
  stop and a start, with the log asked for when stale; the task still open after a quiet quarter hour.
  Following a plan inherits it.
- **Following a plan**: the plan's state for the plan's whole life; at a stop or a start, a plan standing at a
  checkpoint waits for the user's look, or in auto mode holds the stop and carries on, and with a task in hand it
  carries on as Working does; what a wait or a sequence interrupts it comes back to it.
- **Waiting on a worker**: a worker reporting or stopping is told, and the agent is released when its last worker
  is back.
- **Waiting on a question**: the answer releases the agent, told how to read it.
- **Expecting something outside**: after five quiet minutes the agent is told to check what it awaits; its own
  next tool use is working again and releases it.
- **Stuck**: nothing is said until the agent's own next tool use, which releases it.
- **Running a sequence**: the step in hand said at a stop.

A workflow of your own is for a state at an event no default covers, made with New workflow or `journal chart new "<title>" --for <state> --on <event>`; a default one is edited in place.

## Three kinds of box

- A **trigger** is an event. Every hook the agent sends is one: the session starts, a prompt is sent, a tool is
  about to run, a tool finished, the agent stops, a subagent starts or ends, the context compacts, the session
  ends, the clock ticks. Every row is one too: a task created, a plan updated, a message deleted, and so on for
  each kind of row. A trigger only starts a path; no line leads into it.
- A **check** is a yes or no question the journal answers from its rows: are tasks open, is a task in hand, is a
  message unread, is auto mode on, does the tool about to run write. A check leaves
  by a yes line and a no line; one of them may be left out, and the path then ends on that answer. Counter
  checks take a number in their text, or the name of a setting that holds it: every third tool use with a message
  unread, fifteen tool uses with a message unanswered, twenty edits since the last log.
- An **action** is what the journal does, with the line it says: say a line to the agent, hold the tool it was
  about to use, block its stop, type a line into its terminal, start a sequence by its title. The line may name
  rows with placeholders: `{{next_task}}`, `{{next_task_title}}`, `{{parked_tasks}}`, `{{parked_n}}`, `{{parked_title}}`, `{{parked_why}}`,
  `{{inbox}}`, `{{unread_count}}`, `{{unread_numbers}}`, `{{owed}}`, `{{task}}`, `{{task_edits}}`, `{{log_command}}`, `{{awaited}}`,
  `{{quiet_minutes}}`, `{{row}}`, `{{worker_n}}`, `{{worker_name}}`, `{{question_n}}`, `{{sequence_n}}`, `{{sequence_step}}` and
  `{{sequence_step_text}}`. A say or type line that opens with a nudge's key
  in brackets, `[messages.new]`, speaks as that nudge.

Lines join the boxes: then from a trigger or an action, yes or no from a check.

## When the chart is walked

At every event the engine reads the chart afresh and follows each trigger box for that event: a check sends the
path on by its answer, an action acts and sends it on. An agent event, such as a tool about to run or a stop, is
walked before the hook is answered, so a hold or a blocked stop reaches the agent and a said line rides on the
answer. A row event is walked a moment later and can only say or type. Each walk leaves a trace with the boxes it
passed, so the viewer can say why the agent heard a line.

A node's message that opens with a feature's key in brackets, such as `[messages.unread_held]`, belongs to that
feature: it speaks through the feature's nudge, with its repeat window, and where the feature is switched off the
node says nothing and holds nothing. The shipped workflows name their feature on every line and every hold, so
switching messages or tasks off still silences their conduct.

## The page

The Workflows page is two lists and the one workflow they pick. The left list is the states, "When the agent is",
each with a strip of marks, one per event, and a count of how many of its events do something; the right list is
the events of the picked state, "And this happens": every agent event, then the row events the state has a
workflow for, then Add an event for the rest. A mark or a row's word says the one thing that sets a workflow
apart: nothing for a default, a diamond for one changed or made by you, a crossed ring for one turned off, a red
ring when its last run failed, a faded dot for one borrowed from the parent state, a dash for none. A state with
a parent, Following a plan under Working, uses the parent's workflow where it has none of its own, says so, and
offers Make its own, a copy to change; a pair with no workflow offers Start a workflow here. Under the title the
status, when the workflow last ran and what it said, the last step that failed since, and the warning of a wait
nothing ends. Recent runs in the bar opens the last ten runs across every workflow, each opening its workflow
with the steps it took lit. Test run walks the saved workflow for the pair against the agent's rows, nothing
sent, and lights its path; it is offered for the events a trial can stand in for.

## Editing

The page opens read-only. Edit switches editing on, folds the lists into two crumbs and says in the bar that
saving changes this for every agent from the next event, and for the child states that use it; Done switches
it off again, asking first when changes are unsaved, as does picking another pair. By command the same guard is
`--edit-default` on a default workflow. Drag a line from a port onto a card; drop it on empty canvas and Add step
opens where it fell; click a line to take it out; drag a card to move it; type an action's message in its card,
with the values the server offers to insert. Add step puts a step below the selected one, connected to its first
free output, and says so before you pick. Every change is a draft until you press Save; Undo steps the draft back
and Discard changes drops it. A wrong workflow is refused with its faults under the bar, each naming its step and
selecting it when clicked: a step the catalogue does not know, a line to nowhere or into a trigger, a check with
no line out, a loop, a hold a trigger reaches through no check. A save of a workflow someone saved first is
refused with their name; Save again replaces their version. A workflow for a state that waits on something
outside saves with a warning when nothing in any of the state's workflows releases the agent. Turn off takes the
trigger out and keeps the steps, so the journal stops answering there until Turn on puts it back; Reset to default
puts the shipped workflow back, after asking, and shows only on a default changed or turned off; Delete removes a
workflow you made. Steps shows the same workflow as rows with a picker for each output, for a phone or a keyboard.

The shipped chart today: at a stop, at rest, parked tasks hold the stop and are named in any mode, and
in auto mode the next open task holds the stop. The rules the states still keep are listed in the-rules.md.
