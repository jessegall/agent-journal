from journal.features.entry import Entry
from journal.features.feature import Feature
from journal.features.tasks.commands.await_command import AwaitCommand
from journal.features.tasks.commands.stuck_command import StuckCommand
from journal.features.tasks.commands.task_command import TaskCommand
from journal.features.tasks.listeners.clear_waits import ClearWaits
from journal.features.tasks.listeners.let_go_of_closed_task import LetGoOfClosedTask
from journal.features.tasks.listeners.no_wait_cycles import NoWaitCycles
from journal.features.tasks.listeners.one_task_in_hand import OneTaskInHand
from journal.features.tasks.listeners.spot_polling import SpotPolling
from journal.engine.nudge import Nudge
from journal.models.node_kind import NodeKind
from journal.models.option import Option
from journal.features.skill import Skill
from journal.features.tasks.states.expecting import Expecting
from journal.features.tasks.states.stuck import Stuck
from journal.features.tasks.states.idle import Idle
from journal.features.tasks.states.working import Working


class Tasks(Feature):
    name = "tasks"
    title = "Tasks"
    help = "A task is one unit of work with a life; a stop with one in hand is told to carry on, and its log is asked for as the edits mount."
    states = (Idle, Working, Stuck, Expecting)
    commands = (TaskCommand, AwaitCommand, StuckCommand)
    AUTO = Option("tasks.auto", "Work the list on its own", "At a stop with tasks open, the next one holds the stop until it is taken up; off, the agent stops and waits for you", True, kind="switch")
    FIRST_AFTER = Option("tasks.first_nudge_after", "Ask for a log after", "Edits with nothing logged before the agent is asked where the task stands; Working's workflow reads it against the edits count", 25, unit="edits")
    NAME_EVERY = Option("tasks.name_every", "Name the task back every", "Edits between namings of the task in hand, so drift is noticed; read against the edits count", 25, unit="edits")
    LOG_AFTER = Option("tasks.log_after", "Hold the next write after", "Edits with nothing logged before the next write waits for a log line; read against the edits count, a held write not counted", 50, unit="edits")
    options = (AUTO, FIRST_AFTER, NAME_EVERY, LOG_AFTER)
    listeners = (SpotPolling, ClearWaits, OneTaskInHand, LetGoOfClosedTask, NoWaitCycles)
    checks = (
        Entry(NodeKind.CHECK, 'open_tasks', 'Has open tasks?', 'the environment has open tasks the agent may take up, outside a plan not yet started'),
        Entry(NodeKind.CHECK, 'related_tasks', 'Has a task to take up meanwhile?', 'a started plan has a next task, or, with no plan started, a task is open outside a plan'),
        Entry(NodeKind.CHECK, 'task_in_hand', 'Has a task in hand?', 'the agent has a task started'),
        Entry(NodeKind.CHECK, 'parked_tasks', 'Has parked tasks?', 'a task is parked'),
        Entry(NodeKind.CHECK, 'blocked_tasks', 'Has blocked tasks?', 'a task waits on something outside'),
        Entry(NodeKind.CHECK, 'log_stale_over', 'Is the log older than N?', 'the task in hand was last logged longer ago than the time in the text, with its unit: 10 minutes, 2 hours; a bare number is seconds; or never', takes_text=True),
        Entry(NodeKind.CHECK, 'task_just_started', 'Task just started by this agent?', 'the row is a task this agent has just started: this write set when it started, by the agent walking'),
        Entry(NodeKind.CHECK, 'log_for_task_in_hand', 'Log is for the task in hand?', 'the row is a log line of the task this agent has in hand'),
    )

    CARRY_ON = Nudge(name, "carry_on", "{{name}} is in hand, {{logged}}: carry on", "`journal stuck \"<why>\"` if you are truly stuck", repeat_after=0)
    LOG_OLD = Nudge(name, "log_old", "{{name}}, {{logged}}: log where it stands first", "{{log_command}} \"<where it stands>\"", repeat_after=0)
    OPEN = Nudge(name, "open", "{{name}} is still open: log where it stands or finish it", repeat_after=900)
    UNLOGGED = Nudge(name, "unlogged", "task {{n}} is open with nothing logged")
    NEXT = Nudge(name, "next", "tasks are open, and auto mode is on: task {{n}} is next", "sure you want to stop? carry on with it, or `journal stuck \"<why>\"` if you are truly stuck", repeat_after=0)
    DEFERRED = Nudge(name, "deferred", "work deferred in words, not filed: `journal task create` it")
    CLOSED_BY_COMMIT = Nudge(name, "closed_by_commit", "commit {{sha}} closed {{tasks}}")
    POLLING = Nudge(name, "polling", "you ran the same check {{times}} times in a row: {{command}}", "wait for it instead of polling")
    LOG_SOON = Nudge(name, "log_soon", "{{edits}} edits since you logged {{name}}: say where it stands", "{{log}} \"<where it stands>\"", repeat_after=0)
    LOG_OVERDUE = Nudge(name, "log_overdue", "{{edits}} edits since you logged {{name}}", "{{log}} \"<what was decided or done, and why>\" before any other write", repeat_after=0)
    IN_HAND = Nudge(name, "in_hand", "{{name}} in hand, {{edits}} edits", "if this is not what you are doing, finish it or park it and start the work you are on", repeat_after=0)
    PARKED = Nudge(name, "parked", "parked tasks, still open: {{tasks}}", "`journal task resume <n>` picks one up", repeat_after=0)
    PARKED_STILL = Nudge(name, "parked_still", "task {{n}} is still parked: can you continue it now?", "it was parked because: {{why}}. `journal task resume {{n}}` picks it up again", repeat_after=900)
    CHECK_AWAITED = Nudge(name, "check_awaited", "check {{what}} now: you have waited {{minutes}} min", "look at it. Still going: `journal await` again. Done or failed: log what came of it and take the next step", repeat_after=300)
    CHECK_IN = Nudge(name, "check_in", "nothing has happened for half an hour: is there anything left for you to do?", "carry on, take the next task, or say so in one line", repeat_after=1800)
    WAIT_CLEARED = Nudge(name, "wait_cleared", "task {{n}} is open again: {{on}} is answered or closed", "`journal task start {{n}}` takes it up", repeat_after=0)
    nudges = (CARRY_ON, LOG_OLD, OPEN, UNLOGGED, NEXT, PARKED, DEFERRED, CLOSED_BY_COMMIT, POLLING, LOG_SOON, LOG_OVERDUE, IN_HAND, PARKED_STILL, CHECK_AWAITED, CHECK_IN, WAIT_CLEARED)

    skill = Skill("tasks", 'Declare, log and finish the work in hand; load it when you start or are asked to', """
# Tasks

A task is one unit of work with a life: open, started, done. Only one is in hand at a time. A quick edit
needs no task; file one for work that is an item of its own, that waits, or that the user should see tracked.

- `journal task create "<title>" --brief "<what and where to start>"` files one; add `--start` to take it at once, and
  `--from <message n>` when it comes from one of the user's messages.
- `journal task rename <n> "<title>"` says the title again when the first one was wrong.
- `journal task start <n>` takes a task in hand. `journal task list` shows every task here.
- `journal task log <n> "<where it stands>"` after each step that matters; before a compaction, always.
- `journal task done <n> --how "<outcome>"` finishes it. The output names the next open task.
- One task in hand at a time: a second start is refused until the first is done or parked. `journal task park <n> "<why>"`
  sets a started task aside for something else first; `journal task resume <n>` picks it up. Park for choice, never for being stuck.
- A task that waits on something outside your hands, a decision, an answer, a dependency, is blocked:
  `journal task block <n> "<what it waits on>"`. Blocked is neither offered nor nudged, only listed with its reason;
  `journal task unblock <n>` opens it again when what it waited on came. `journal task block <n> --on question:12`
  (or `--on task:7`) opens it by itself once that row is answered or closed.
- Waiting on something outside your hands, a command, a run or a person: `journal await "<what you wait for>"` and end
  your turn; working again lifts it, and every five quiet minutes you are asked to look.
- Log as you go, counted in edits: after twenty-five with nothing logged you are asked to, every twenty-five the work in hand is named
  back so drift is noticed, and at fifty the next write waits for the log line (settings tasks.first_nudge_after,
  tasks.name_every and tasks.log_after). A log line starts a new version.
- A stop with work in hand names it back with when it was last logged, three times a version; then the stop passes.
- A commit whose message carries `Journal: tasks done <n>` on a line of its own finishes task n.
- Auto mode (the setting tasks.auto, on by default) means you work the list: a stop with tasks open is answered with the next
  one, and only the user stops you. A stop with parked tasks names them, in auto mode or not: parked is still open.
- Work you put off in words is work lost: file it as a task instead.
- Stopping with a task in hand is told to carry on. Truly stuck: `journal stuck "<why>"`.
""", keywords=('task', 'tasks', 'todo'), required_in=('working', 'stuck', 'expecting'))
