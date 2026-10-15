# The chart: the journal's conduct, drawn

The Workflow page shows how the journal treats the agent as a flowchart, and lets you change it. There is one
chart per journal. The journal ships it with today's conduct, so nothing changes until you edit it.

## Three kinds of box

- A **trigger** is an event. Every hook the agent sends is one: the session starts, a prompt is sent, a tool is
  about to run, a tool finished, the agent stops, a subagent starts or ends, the context compacts, the session
  ends, the clock ticks. Every row is one too: a task created, a plan updated, a message deleted, and so on for
  each kind of row. A trigger only starts a path; no line leads into it.
- A **check** is a yes or no question the journal answers from its rows: are tasks open, is a task in hand, is a
  message unread, is auto mode on, is this the same stop again, does the tool about to run write. A check leaves
  by a yes line and a no line; one of them may be left out, and the path then ends on that answer. Counter
  checks take a number in their text, or the name of a setting that holds it: every third tool use with a message
  unread, fifteen tool uses with a message unanswered, twenty edits since the last log.
- An **action** is what the journal does, with the line it says: say a line to the agent, hold the tool it was
  about to use, block its stop, type a line into its terminal, start a sequence by its title. The line may name
  rows with placeholders such as `{{next_task}}`, `{{next_task_title}}` and `{{parked_tasks}}`.

Lines join the boxes: then from a trigger or an action, yes or no from a check.

## When the chart is walked

At every event the engine reads the chart afresh and follows each trigger box for that event: a check sends the
path on by its answer, an action acts and sends it on. An agent event, such as a tool about to run or a stop, is
walked before the hook is answered, so a hold or a blocked stop reaches the agent and a said line rides on the
answer. A row event is walked a moment later and can only say or type. Each walk leaves a trace with the boxes it
passed, so the viewer can say why the agent heard a line.

## Editing

Drag a line from a port onto a box; click a line to take it out; drag a box by its head; type an action's line in
its box. Every change is a draft until you press Save; Undo steps the draft back. A wrong chart is refused with
its faults named: a box the catalogue does not know, a line to nowhere or into a trigger, a check with no line
out, a loop. Back to the shipped chart throws every edit away. As a list shows the same chart as rows with a
picker for each port, for a phone or a keyboard. Try it dry runs the chart for an agent event without doing
anything, and shows the path and what it would do.

The shipped chart today: at a stop, at rest and not the same stop again, parked tasks are named in any mode, and
in auto mode the next open task holds the stop. The rules the states still keep are listed in the-rules.md.
