# The chart: the journal's conduct, drawn

The Workflow page shows how the journal treats the agent as a flowchart, and lets you change it. A workflow is bound
to a state, or to the base that holds what every state shares, and holds one trigger per event it answers; a state has
one workflow. Workflows of the older shape, bound to one event each, answer by their event until they retire: a journal holds one such workflow
per event, each starting at its event's trigger; a second on the same event is refused, since two would both drive
the agent, and should a journal somehow hold two, the older one answers and the page marks the other sidelined. The journal ships it with today's conduct, so nothing changes until you edit it.

The walk reads the agent's state once, after the engine's machine and holds have answered the event, and every
check and filler reads that same state; so a tool use that lifts a wait is walked as Working, and a session start
finds the agent orienting. The trace of a walk names the state it read and the workflows it ran, in the order they run: the base first, then the
workflow of the agent's state or of the nearest state it inherits from, following a plan being a kind of working and
every wait a kind of pause, then a workflow of the older shape that answers the event by itself.

A workflow may move the agent, through the engine's machine: a release sends a paused agent back to what it was
doing, and a move to idle is allowed from a state that owns nothing. An agent with a task in hand, a wait with its
way back, or a step it owes the journal stays where it is, and the walk records why.

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
  `{{quiet_minutes}}`, `{{row}}`, `{{worker_n}}`, `{{worker_name}}` and `{{question_n}}`. A say or type line that opens with a nudge's key
  in brackets, `[messages.new]`, speaks as that nudge.

Lines join the boxes: then from a trigger or an action, yes or no from a check.

## When the chart is walked

At every event the engine reads the chart afresh and follows each trigger box for that event: a check sends the
path on by its answer, an action acts and sends it on. An agent event, such as a tool about to run or a stop, is
walked before the hook is answered, so a hold or a blocked stop reaches the agent and a said line rides on the
answer. A row event is walked a moment later and can only say or type. Each walk leaves a trace with the boxes it
passed, so the viewer can say why the agent heard a line.

## Editing

Drag a line from a port onto a card; drop it on empty canvas and Add node opens where it fell; click a line to
take it out; drag a card to move it; type an action's message in its card. Add node puts a node below the
selected one, connected to its first free output, and says so before you pick. Every change is a draft until you
press Save; Undo steps the draft back and Discard changes drops it. A wrong workflow is refused with its faults
named: a node the catalogue does not know, a line to nowhere or into a trigger, a check with no line out, a
loop. Reset to default puts the shipped workflow back, after asking. List shows the same workflow as cards with
a picker for each output, for a phone or a keyboard. Test runs the workflow for its own event without doing
anything, and shows the steps and what it would do in a side panel.

The shipped chart today: at a stop, at rest, parked tasks hold the stop and are named in any mode, and
in auto mode the next open task holds the stop. The rules the states still keep are listed in the-rules.md.
