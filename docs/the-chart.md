# The chart: the journal's conduct, drawn

The Workflow page shows how the journal treats the agent as a flowchart, and lets you change it. A workflow answers
one event, the trigger it holds, and is bound to a state, running only while the agent is in that state, or to none,
running always. An event may have any number of workflows, and they run in one order, the place each holds in the
event's list, which the user sets; a workflow bound to a child state, Following a plan under Working, replaces its
parent's at that event, and what the agent owes the journal never changes which workflows run. The conduct for every state, the inbox
and the answers owed, is an Always workflow per event at the head of each list, after the locked guards, and a
state's shipped workflow carries only the state's own steps. The journal ships them with today's conduct, so
nothing changes until you edit them.

The walk reads the agent's state once, right after the engine's machine has answered the event and before the engine's
holds, and every check and filler reads that same state; a session start is walked as the state the agent resumes
in, before the briefing's hold takes it. One move per event: a release or a move inside a workflow re-reads the
state, the new state's workflows that come later in the event's order run at their place, and a second move in the
same event is refused and recorded naming both nodes. The first hold of an event wins: a later hold, in the same
workflow or another, is recorded as not answered and only its words ride. The shipped workflows place the waits
before the states they go back to, so a tool use that lifts a wait is walked as Working too. The trace of a walk names the state it ended in and the workflows it ran, in the order they run: the
workflow of the agent's state or of the nearest state it inherits from, following a plan being a kind of working and
every wait a kind of pause, then a workflow of the older shape that answers the event by itself.

A workflow may change the agent's state, through the engine's machine, by what the change comes to: Send the
agent back to what it was doing sends an agent in any pause back to what it was doing; Change state to Idle is
allowed from a state that owns nothing; Wait for something outside lays that wait over what the agent is doing,
with what it waits for in the text, and Mark the agent stuck lays being stuck over it, with why in the text, so a
workflow can make the agent wait on something outside; a wait or a stuck with no words is refused at the save. A
state that owns a row, working, following a plan, waiting on a question, awaiting a worker, running a sequence,
is entered by what makes that row, and no node enters it. A workflow of the older shape that named a state to move
to is rewritten at boot to the action its outcome names.

A trial, `journal chart try <event>`, walks the workflows dry and says the path and what it would do, nothing done; it
walks as the live agent, or as the state given with `--state`, with the agent's own data when it is in that state, and as
a `--provider` whose tool names the tool event takes; `--quiet`, `--edits` and `--unread` lay a state over the live rows,
and the trial says everything it assumed.

Each workflow is compiled once into a graph in memory and walked from there; a write to any workflow through the
journal clears the compiled graphs, so the next walk reads the edit.

## The shipped workflows

Every shipped workflow holds one concern, and the run order and the end of a walk carry the design: at an event the
Always workflows run first, then each state's in the order its state ships at, a child state before its parent (the
agent following a plan runs its own workflows and then Working's), and the first workflow that keeps the agent from
stopping, or says Stop the later workflows, ends the walk so nothing after it runs. Two kinds of number are read: the
readings, which the journal takes from its own record (edits since the log, uses since the newest unread message,
owed since a message was read and left unanswered, namings of an unread inbox, lines since the etiquette reminder),
and the counts a workflow keeps itself, each its own and for each agent. What the agent owes the journal, the journal skill and a state's skill, the
look at what is in flight, a decision at a context mark, is the engine's: the skills, briefing and memory features
set each debt and hold a write and a stop on it, with no node on the canvas.

At Session start: tell the agent the journal's rules, facts and what waits; tell the agent how to talk to the user;
what is unread is the engine's delivery there, catching the agent up on a line it may have missed. At User prompt submit and Stop: say what is unread. At Pre tool use: hold a write while
messages stay unread after a number of reminders; name the unread messages every so many tool uses; hold the tools
while a read message stays unanswered; ask for an answer after so many tool uses; each on the agent's own tool use, never a subagent's.
Idle at a stop holds it while a task is parked, then in auto mode while tasks are open; at a tick it asks about a
parked task after a minute and checks in after half an hour in auto mode. Following a plan holds the stop at a
checkpoint in auto mode, or says the user looks first and stops the walk. Working, at a stop and a start, tells the
agent to carry on and asks for a log when the log is old; at a write it holds the write when the log is overdue,
asks for a log after N edits and names the task in hand every N edits; at a tick it asks how the task stands after
fifteen quiet minutes. The waits tell the agent a worker reported or a question was answered and send it back. A title that
reads a setting says the setting's number, drawn from it, and a boot retitles the workflow when the setting changed;
a title you give stays.

The journal's guards come first: The guards, a locked workflow titled by what it does (Hold writes while something is owed, and over unread or unanswered messages), is bound to no state, at the head
of the list in every journal, drawn back by any boot that finds it missing, where a skill owed holds a write
until its file is read, a write before the look at what is in flight here is held until `journal environment
here`, a write at a context mark not decided at is held until a fact, a rule or `journal nothing`, the unread
inbox is named every so many tool uses and the write held after so many namings, and a read message answered
before the next tool, held after so many uses. Every Always or Guards workflow at an agent event opens with the
context mark, locked: the context crossing a quarter, a half or four fifths holds the agent at it, told to decide
what survives, and the mark owed is a fact on its row until it does. Then the conduct for every
state, one Always workflow per event, bound to no state and placed after the locked ones: the Always workflow at Session start
requires the journal skill (locked), names the inbox, requires a look at what is in flight (locked) and then says the start block line by line, ready, quiet, the laws (locked), a takeover when another session worked here lately, the rules, facts and reminders when there are any, what waits, and how to talk to the user, owing the look that
`journal environment here` pays, the Always workflow at User prompt submit requires the skills a prompt names
(locked) and names the inbox, the Always workflow at Stop holds a stop while the agent owes the journal something, naming what it awaits (locked), before the mark, so a mark crossed at that very stop is told once and not yet held for, and names the inbox. Delivering a message to the agent is the engine's, not a workflow: the messages feature types a message you leave into the agent's terminal by number and starts its counts of tool uses and inbox namings, and starts the count of uses it owes an answer on at the first message read and left unanswered; nothing is shipped at Message created or Message updated. A state whose feature has a
skill requires it at Session start in that state, in the state's own workflow there. Require a skill names the
skill in its text; empty, it takes the skills the prompt names at a prompt and the state's skill elsewhere. A state's workflow at an event carries only the state's own
steps, and a state with nothing of its own at an event has no workflow there; a copy from before, edited by you,
keeps your steps and the state's and loses the shared ones at the boot that moves them. Each state's own:

- **Idle**: at a stop, parked tasks hold it in any mode and the next open task in auto mode; as the clock ticks, the
  parked ask after a minute and the check-in after half an hour.
- **Working**: the edits since the log counted on the canvas, started at nought when this agent starts a task and
  when a log line comes for the task in hand; at a write the task is named every so many edits, the log asked for
  at the first threshold and the write held when the log is overdue, a held write not counted; carry on at a stop
  and a start, with the log asked for when stale; the task still open after a quiet quarter hour. Following a plan
  inherits it.
- **Following a plan**: the plan's state for the plan's whole life; at a stop or a start, a plan standing at a
  checkpoint waits for the user's look, or in auto mode holds the stop and carries on, and with a task in hand it
  carries on as Working does; what a wait or a sequence interrupts it comes back to it.
- **Waiting on a worker**: a worker reporting or stopping is told, and the agent is released when its last worker
  is back.
- **Waiting on a question**: the answer releases the agent, told how to read it.
- **Expecting something outside**: after five quiet minutes the agent is told to check what it awaits; its own
  next tool use is working again and releases it.
- **Stuck**: nothing is said until the agent's own next tool use, which releases it.
- **Ended**: at a start, nothing of its own yet; the workflow holds its trigger alone, so the state is on the page
  with something to open, until the session's end and start move into the workflows.

A workflow of your own is for a state at an event no default covers, made with New workflow or `journal chart new "<title>" --for <state> --on <event>`; a default one is edited in place.

## Three kinds of box

Every check and action a box may name is declared by the feature it belongs to, in that feature's own file: the
tasks feature declares Has open tasks? and the log's age, the messages feature the inbox checks, the skills
feature Require a skill to be read, the chart feature the counts, the holds and the moves. The catalogue gathers
them from the features and defines none itself; the chart's checks and actions answer and perform them. The checks
that read the event's own content take words: Tool is one of Write, Edit; Tool input contains git push; Prompt contains
deploy; Context over 60 percent; Time of day within 22:00-06:00, a tick reading its own time and any other event now. A check
on time takes its unit: Has the agent been quiet for 30 minutes?, Is the log older than 2 hours?; a bare number is seconds.

A workflow can run another: the action Run a workflow names one by its title, and the walk runs that workflow's
steps from its trigger on, in place, as part of the event that reached the caller, so one drawing serves several
events or states. A workflow cannot run itself, directly or through another: the save refuses it, and a call into
a workflow already running in the same call is refused and recorded.

- A **trigger** is an event. Every hook the agent sends is one: the session starts, a prompt is sent, a tool is
  about to run, a tool finished, the agent stops, a subagent starts or ends, the context compacts, the session
  ends, the clock ticks. Every row is one too: a task created, a plan updated, a message deleted, and so on for
  each kind of row. A trigger only starts a path; no line leads into it.
- A **check** is a yes or no question the journal answers from its rows: are tasks open, is a task in hand, is a
  message unread, is auto mode on, does the tool about to run write. A check leaves
  by a yes line and a no line; one of them may be left out, and the path then ends on that answer. Counter
  checks take a number in their text, or the name of a setting that holds it: four or more messages unread, quiet
  for so many seconds, the log older than so many seconds. A count check reads a count the workflow keeps for the
  agent, or a reading, named first in its text, against the number after it: is the count over N, at N, at every
  Nth (a multiple of N, never nought), and Wait here until a count reaches N, which goes on once it has and waits
  there until then, its No needing no line. Each workflow keeps its own counts, so two workflows' counts of one
  name never meet, and one workflow may hold a trigger for each event it needs, its counts shared by all of them: a
  count started when a message comes and counted at each tool is one workflow with two triggers. A count may not take
  a reading's name. No workflow starts at a count's write, a session's counts go when it ends, a count no node of its
  workflow names any more is cleared and the chat says so, and a workflow reading a count none of its own nodes
  keeps is turned off at boot with its title saying why. A row event's checks read the row the
  event is about: a message just read, a task just started by this agent, a log line for the task in hand, a
  message written by you.
- An **action** is what the journal does, with the line it says: say a line to the agent, hold the tool it was
  about to use, block its stop, type a line into its terminal, start a sequence by its title. Start a count, Start a
  count if not started and Count one keep a number for the agent between events, named in their text: Start a count
  sets it to nought every time, so it is how a count starts again where its reason ends; Start a count if not started
  only the first time. A workflow that only counts walks after the hook's reply. A line says a count or a reading
  with `{{value.<name>}}`. The line may name
  rows with placeholders: `{{next_task}}`, `{{next_task_title}}`, `{{parked_tasks}}`, `{{parked_n}}`, `{{parked_title}}`, `{{parked_why}}`,
  `{{inbox}}`, `{{unread_count}}`, `{{unread_numbers}}`, `{{owed}}`, `{{task}}`, `{{task_edits}}`, `{{log_command}}`, `{{awaited}}`,
  `{{quiet_minutes}}`, `{{row}}`, `{{worker_n}}`, `{{worker_name}}`, `{{question_n}}`, `{{sequence_n}}`, `{{sequence_step}}` and
  `{{sequence_step_text}}`. A say or type line that opens with a nudge's key
  in brackets, `[messages.new]`, speaks as that nudge.

Lines join the boxes: then from a trigger or an action, yes or no from a check, and one line per port, so a
workflow is one path read top to bottom and nothing runs side by side. A shipped workflow chains its steps into one
path, every open end leading on to the next part. A step that
raises is recorded where the page shows it and the path goes on past it, by no from a check and by then from an
action, so one broken step never silences what follows.

## When the chart is walked

An agent event walks its workflows in two parts. Those that can change the hook's answer or move the agent, any with a
hold, a held stop, a line said, a move or Stop the later workflows, walk before the hook is answered. Those that only
type into the terminal, show a card or start a sequence walk after the reply on the deferred worker, in the same run
order, so the agent never waits on them; a walk ended in the first part ends the second part too. A tick, answered by
no hook, walks them all at once.

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

The Workflows page is an event list, the event's workflows in the order they run, and the one workflow picked.
The left list is the events: every agent event, then the row events something answers, then Add an event for the
rest; each shows how many workflows answer it, a dash when none. The middle list, "Run order", is the
event's workflows numbered first to last, each saying when it runs, always or when the agent is in its state, and
the one thing that sets it apart: changed or made by you, turned off, failed. Dragging a row onto another puts it
there; the order is saved at once, for every agent from the next event, and refused with who saved first when the
list changed under you. A filter at the top shows the list as it runs for one state: the always ones and the
nearest state's in the lineage, numbered by their place in the whole list; dragging waits for Every state. New
workflow at the foot starts one at this event, always or for one state, at the last place. A shipped workflow is titled by what it does, in plain words ("Keep the agent going while tasks are open or
parked"); the line under it says when it runs (always, or when the agent is in its state). A workflow of your own
is born "New workflow", takes the title of its first action when you save one, and keeps the name you give it.
A journal whose shipped workflows still carry the older "State at Event" titles, never renamed, takes the plain
titles at boot. The moves the engine makes itself, such as moving the agent to Working when a task starts, are not workflows and are
not shown among them. Recent runs names a
state change in words, by the step that moved the agent or the journal's own move that came first, and the answer
the agent was given, said or held, with the counts each walk left. On the canvas each card says how often it ran; a
count check shows each agent's count against its number, reminders 2 of 3, the number read from its setting, and
where an agent's last walk stopped on a count check's No the card says Waiting here; the step's side panel lists the
waiting agents' counts and what each reading counts. Opening a run lights its path and, on each count card it
passed, the number the check read. Test run says which workflows it would run, in order, where it would stop, and
reads the counts as the live walk would, a count started or counted on the dry path included; `journal chart try
--value <name>=<n>` stands a count in. A mark says the one
thing that sets a workflow apart: nothing for a default, a diamond for one changed or made by you, a crossed ring
for one turned off, a red ring when its last run failed, a dash for none. Under the title the status and when the
workflow runs, when it last ran and what it said, the last step that failed since, and the warning of a wait
nothing ends. Recent runs in the bar opens the last ten runs across every workflow, each opening the first
workflow it walked with the steps it took lit. Test run walks the saved workflows of the event against the
agent's rows as the picked workflow's state, nothing sent, and lights the path; it is offered for the events a
trial can stand in for. The phone shows the same as an Event cell, a Workflow cell that opens the ordered list,
and Run earlier and Run later on the open workflow.

## While something is owed

What the agent owes the journal, a skill to read, the look at what is in flight at a start, a decision at a context
mark, is a fact on its row and never a state over the one it is in: Orienting, At a context mark and Loading a
skill are no states, the engine lists nine, and a journal whose agent stood in one of them at boot unwraps it to
the state it held with the fact set. So a state's own workflows run as they would:
Working at a tick still says the task is open after a quiet quarter hour while the look is owed, the inbox is named
at a prompt while a skill is owed, a wait is released by its row event while a mark is owed. The debt holds only
what it must: a write, through the guards at Pre tool use, and a stop, through the Always workflow at Stop, each
naming what it awaits; the read, the command or the decision that pays it goes through. Beneath every workflow the
engine keeps a floor: a journal command and the read of a skill's file are never held, whatever a hold says, since
they are how a debt is paid; the hold's words still reach the agent. The save warns of a Hold the tool at Tool
about to run with neither Tool changes files? nor Journal command? before it, since it holds every other tool. The phase-two replays
freeze this: working_rules carries the tick's line under the look owed, loading_skill_rules the inbox named under
the skill owed, owed_pause_rules the stop held and the wait kept. The three holds hold under Codex as under Claude,
through its pre-tool hook, as the codex records show; the only event Codex never sends is the agent writing to you,
which the page marks Claude only.

## Locks

A lock marks the journal's law. A locked workflow runs first at its event, keeps the head of the list, and cannot
be deleted or turned off. A locked step, the holds the journal ships as guards of its protocol, cannot be taken
out, reworded or turned off, and you cannot put a check or Stop the later workflows before it on its path: nothing the user
adds decides whether the law runs. What you can do around it: add steps after it, change the numbers in its text,
and Reset to default, which draws it back. A workflow holding a locked step cannot be turned off either. The page
shows the lock on the row and on the card, with one line saying why, and the save, the commands and the order
refuse the same, each saying what you still can.

## Editing

The page opens read-only. Edit switches editing on, folds the lists into two crumbs and says in the bar that
saving changes this for every agent from the next event, and for the child states that use it; Done switches
it off again, asking first when changes are unsaved, as does picking another workflow. By command the same guard is
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
