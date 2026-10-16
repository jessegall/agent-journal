# The chart: the journal's conduct, drawn

The Workflow page shows how the journal treats the agent as a flowchart, and lets you change it. A workflow is bound
to a state and holds one trigger per event it answers; a state has one workflow, and each carries what every state
shares, the inbox and the answers owed, as well as the state's own conduct. Workflows of the older shape, bound to one event each, answer by their event until they retire: a journal holds one such workflow
per event, each starting at its event's trigger; a second on the same event is refused, since two would both drive
the agent, and should a journal somehow hold two, the older one answers and the page marks the other sidelined. The journal ships it with today's conduct, so nothing changes until you edit it.

The walk reads the agent's state once, right after the engine's machine has answered the event and before the engine's
holds, and every check and filler reads that same state; so a tool use that lifts a wait is walked as Working, and a
session start is walked as the state the agent resumes in, before the briefing's hold takes it. The trace of a walk names the state it read and the workflows it ran, in the order they run: the
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

Every one of them carries the shared conduct: a message arriving is typed to the agent; the inbox named at a
start, a prompt and a stop; the unread inbox named every so many tool uses and the write held after so many
namings; a read message answered before the next tool, held after so many uses. And each adds its own:

- **Idle**: at a stop, parked tasks hold it in any mode and the next open task in auto mode; a plan standing at a
  checkpoint waits for the user's look, or in auto mode holds the stop and carries on; as the clock ticks, the
  parked ask after a minute and the check-in after half an hour.
- **Working**: the task in hand named back every so many edits, the log asked for and then held; carry on at a
  stop and a start, with the log asked for when stale; the task still open after a quiet quarter hour.
  Following a plan inherits it.
- **Awaiting a worker**: a worker reporting or stopping is told, and the agent is released when its last worker
  is back.
- **Waiting on a question**: the answer releases the agent, told how to read it.
- **Expecting something outside**: after five quiet minutes the agent is told to check what it awaits.
- **Running a sequence**: the step in hand said at a stop.

A workflow of your own is bound to one event and runs beside them; it is made with New workflow or `journal chart new`.

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

## Editing

The page opens read-only, with a line under the bar saying when the workflow last ran, through which of its nodes,
and the last node that failed in it. Edit switches editing on, after a word that changes alter how the journal
drives the agent; a save, or another workflow opened, switches it off again. By command the same guard is
`--edit-default` on a default workflow. A workflow with no trigger is marked off in the list: the journal does
nothing there until a trigger is added or it is reset. Drag a line from a port onto a card; drop it on empty canvas
and Add node opens where it fell; click a line to take it out; drag a card to move it; type an action's message in
its card. Add node puts a node below the
selected one, connected to its first free output, and says so before you pick. Every change is a draft until you
press Save; Undo steps the draft back and Discard changes drops it. A wrong workflow is refused with its faults
named: a node the catalogue does not know, a line to nowhere or into a trigger, a check with no line out, a
loop, a hold a trigger reaches through no check. A workflow for a state that waits on something outside saves
with a warning when nothing in it releases the agent. Reset to default puts the shipped workflow back, after
asking; a default workflow cannot be deleted, only emptied or reset. List shows the same workflow as cards with
a picker for each output, for a phone or a keyboard. Test runs the workflow for one of its events without doing
anything, and shows the steps and what it would do in a side panel.

The shipped chart today: at a stop, at rest, parked tasks hold the stop and are named in any mode, and
in auto mode the next open task holds the stop. The rules the states still keep are listed in the-rules.md.
