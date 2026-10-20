from journal.support.entry import Entry
from journal.features.feature import Feature
from journal.features.tasks.support.tasks_standing_reader import TasksStandingReader
from journal.features.tasks.commands.await_command import AwaitCommand
from journal.features.tasks.commands.stuck_command import StuckCommand
from journal.features.tasks.commands.task_command import TaskCommand
from journal.features.tasks.listeners.clear_waits import ClearWaits
from journal.features.tasks.listeners.end_settled_waits import EndSettledWaits
from journal.features.tasks.listeners.let_go_of_closed_task import LetGoOfClosedTask
from journal.features.tasks.listeners.no_wait_cycles import NoWaitCycles
from journal.features.tasks.listeners.one_task_in_hand import OneTaskInHand
from journal.features.tasks.support.tasks_conduct import TasksConduct
from journal.engine.nudge import Nudge
from journal.models.node_kind import NodeKind
from journal.support.option import Option
from journal.support.skill import Skill
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
    FIRST_AFTER = Option("tasks.first_nudge_after", "Ask for a log after", "Edits without a log line before the agent is asked where its task stands", 25, unit="edits")
    NAME_EVERY = Option("tasks.name_every", "Name the task back every", "Edits between reminders of the task in hand, so drift is noticed", 25, unit="edits")
    LOG_AFTER = Option("tasks.log_after", "Hold the next write after", "Edits without a log line before the agent's next write waits for one", 50, unit="edits")
    options = (AUTO, FIRST_AFTER, NAME_EVERY, LOG_AFTER)
    listeners = (ClearWaits, EndSettledWaits, OneTaskInHand, LetGoOfClosedTask, NoWaitCycles)
    conduct = (TasksConduct,)
    standing = (TasksStandingReader,)
    checks = (
        Entry(NodeKind.CHECK, 'open_tasks', 'Has open tasks?', 'the environment has open tasks the agent may take up, outside a plan not yet started'),
        Entry(NodeKind.CHECK, 'related_tasks', 'Has a task to take up meanwhile?', 'a started plan has a next task, or, with no plan started, a task is open outside a plan'),
        Entry(NodeKind.CHECK, 'task_in_hand', 'Has a task in hand?', 'the agent has a task started'),
        Entry(NodeKind.CHECK, 'parked_tasks', 'Has parked tasks?', 'a task is parked'),
        Entry(NodeKind.CHECK, 'blocked_tasks', 'Has blocked tasks?', 'a task is blocked'),
        Entry(NodeKind.CHECK, 'blocked_outside', 'Has a blocked task nothing opens by itself?', 'a blocked task waits on no task, question or check that opens it, only a reason in words'),
        Entry(NodeKind.CHECK, 'broken_waits', 'Has a task waiting on a check that cannot run?', 'a blocked task waits until a check whose command could not run, a missing program or a time-out, so it would wait forever'),
        Entry(NodeKind.CHECK, 'task_just_started', 'Task just started by this agent?', 'the row is a task this agent has just started: this write set when it started, by the agent walking'),
        Entry(NodeKind.CHECK, 'log_for_task_in_hand', 'Log is for the task in hand?', 'the row is a log line of the task this agent has in hand'),
        Entry(NodeKind.CHECK, 'task_just_taken', 'Task just taken in hand by this agent?', 'the row is a task this agent has just started, resumed after a park, or claimed'),
        Entry(NodeKind.CHECK, 'task_just_parked', 'Task just parked?', 'the row is a task that was just parked'),
        Entry(NodeKind.CHECK, 'task_just_blocked', 'Task just blocked?', 'the row is a task that was just blocked'),
        Entry(NodeKind.CHECK, 'task_just_done', 'Task just done?', 'the row is a task that was just finished, by command or by a commit'),
    )

    CARRY_ON = Nudge(name, "carry_on", "{{name}} is in hand, {{logged}}: carry on", "`journal stuck \"<why>\"` if you are truly stuck", repeat_after=0)
    LOG_FIRST_AT_STOP = Nudge(name, "log_first_at_stop", "{{name}}, {{logged}}: log where it stands first", "{{log_command}} \"<where it stands>\"", repeat_after=0)
    TASK_STILL_OPEN = Nudge(name, "task_still_open", "{{name}} is still open: log where it stands or finish it", repeat_after=900)
    TASK_OPEN_WITH_NOTHING_LOGGED = Nudge(name, "task_open_with_nothing_logged", "task {{n}} is open with nothing logged")
    NEXT_TASK_HOLDS_THE_STOP = Nudge(name, "next_task_holds_the_stop", "tasks are open, and auto mode is on: task {{n}} is next", "sure you want to stop? carry on with it, or `journal stuck \"<why>\"` if you are truly stuck", repeat_after=0)
    DEFERRED_WORK_IS_A_TASK = Nudge(name, "deferred_work_is_a_task", "work deferred in words, not filed: `journal task create` it")
    CLOSED_BY_COMMIT = Nudge(name, "closed_by_commit", "commit {{sha}} closed {{tasks}}")
    STOP_POLLING = Nudge(name, "stop_polling", "you ran the same check {{times}} times in a row: {{command}}", "wait for it instead of polling")
    LOG_WHERE_IT_STANDS = Nudge(name, "log_where_it_stands", "{{edits}} edits since you logged {{name}}: say where it stands", "{{log}} \"<where it stands>\"", repeat_after=0)
    WRITE_HELD_UNTIL_LOGGED = Nudge(name, "write_held_until_logged", "{{edits}} edits since you logged {{name}}", "{{log}} \"<what was decided or done, and why>\" before any other write", repeat_after=0)
    TASK_IN_HAND_NAMED_BACK = Nudge(name, "task_in_hand_named_back", "{{name}} in hand, {{edits}} edits", "if this is not what you are doing, finish it or park it and start the work you are on", repeat_after=0)
    PARKED_TASKS_STILL_OPEN = Nudge(name, "parked_tasks_still_open", "parked tasks, still open: {{tasks}}", "`journal task resume <n>` picks one up", repeat_after=0)
    CONTINUE_THE_PARKED_TASK = Nudge(name, "continue_the_parked_task", "task {{n}} is still parked: can you continue it now?", "it was parked because: {{why}}. `journal task resume {{n}}` picks it up again", repeat_after=900)
    CONTINUE_THE_PARKED_TASK_AT_CLOSE = Nudge(name, "continue_the_parked_task_at_close", "task {{n}} is still parked: can you continue it now?", "it was parked because: {{why}}. `journal task resume {{n}}` picks it up again", repeat_after=0)
    CHECK_WHAT_YOU_AWAITED = Nudge(name, "check_what_you_awaited", "check {{what}} now: you have waited {{minutes}} min", "look at it. Still going: `journal await` again. Done or failed: log what came of it and take the next step", repeat_after=300, held_whatever_its_values=True)
    ANYTHING_LEFT_TO_DO = Nudge(name, "anything_left_to_do", "nothing has happened for half an hour: is there anything left for you to do?", "carry on, take the next task, or say so in one line", repeat_after=1800)
    WAIT_OVER = Nudge(name, "wait_over", "the wait for {{what}} is over: {{came}}", "carry on with what you were doing", repeat_after=0)
    TASK_OPEN_AGAIN = Nudge(name, "task_open_again", "task {{n}} is open again: {{on}} is answered or closed", "`journal task start {{n}}` takes it up", repeat_after=0)
    FIX_THE_BROKEN_WAIT = Nudge(name, "fix_the_broken_wait", "{{waits}}", "so it would wait forever: fix the command with `journal task block <n> --until \"<command>\"`, or `journal task unblock <n>`", repeat_after=0)
    UNBLOCK_WHAT_HAS_COME = Nudge(name, "unblock_what_has_come", "blocked, with nothing that opens it by itself: {{tasks}}", "has what it waits on come? `journal task unblock <n>` when it has", repeat_after=2700, held_whatever_its_values=True)
    nudges = (CARRY_ON, LOG_FIRST_AT_STOP, TASK_STILL_OPEN, TASK_OPEN_WITH_NOTHING_LOGGED, NEXT_TASK_HOLDS_THE_STOP, PARKED_TASKS_STILL_OPEN, DEFERRED_WORK_IS_A_TASK, CLOSED_BY_COMMIT, STOP_POLLING, LOG_WHERE_IT_STANDS, WRITE_HELD_UNTIL_LOGGED, TASK_IN_HAND_NAMED_BACK, CONTINUE_THE_PARKED_TASK, CONTINUE_THE_PARKED_TASK_AT_CLOSE, CHECK_WHAT_YOU_AWAITED, ANYTHING_LEFT_TO_DO, WAIT_OVER, TASK_OPEN_AGAIN, FIX_THE_BROKEN_WAIT, UNBLOCK_WHAT_HAS_COME)

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
  (or `--on task:7`) opens it by itself once that row is answered or closed; `--until "<command>"` runs the command
  every two minutes, such as a check that a pull request is merged, and opens it once the command passes.
- Waiting on something outside your hands: `journal await "<what you wait for>" --output <n>` for a command running in the
  background, or `--until "<script>"`, run every 30 seconds, for anything else. The wait ends by itself once that is done,
  and you are told what it came to; working again lifts it too. A wait that names neither, or a wait on the user, is
  refused: ask with `journal question ask`, or end your turn.
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
