from journal.features.feature import Feature
from journal.features.tasks.support.tasks_data_reader import TasksDataReader
from journal.features.tasks.support.tasks_data import TasksData
from journal.features.tasks.commands.wait_command import WaitCommand
from journal.features.tasks.commands.impasse_command import ImpasseCommand
from journal.features.tasks.commands.task_command import TaskCommand
from journal.features.tasks.listeners.clear_waits import ClearWaits
from journal.features.tasks.listeners.wait_cycle_check import WaitCycleCheck
from journal.features.tasks.tasks_conduct import TasksConduct
from journal.engine.nudge import Nudge
from journal.support.option import Option
from journal.support.skill import Skill
from journal.features.tasks.states.external_wait import ExternalWait
from journal.features.tasks.states.impasse import Impasse
from journal.features.tasks.states.ready import Ready
from journal.features.tasks.states.working import Working
from journal.features.tasks.listeners.release_waits import ReleaseWaits


class Tasks(Feature[TasksData]):
    AUTO = Option("tasks.auto", "Work the list on its own", "At a stop with tasks open, the next one holds the stop until it is taken up; off, the agent stops and waits for you", True, kind="switch")
    FIRST_DELAY = Option("tasks.first_nudge_after", "Ask for a log after", "Edits without a log line before the agent is asked where its task stands", 25, unit="edits")
    TASK_REMINDER_INTERVAL = Option("tasks.name_every", "Name the task back every", "Edits between reminders of the task in hand, so drift is noticed", 25, unit="edits")
    LOG_LIMIT = Option("tasks.log_after", "Hold the next write after", "Edits without a log line before the agent's next write waits for one", 50, unit="edits")
    LOG_AGE_LIMIT = Option("tasks.log_old_after_minutes", "Ask for a log at a stop after", "Minutes since the task's last log line before a stop asks for one before carrying on", 10, unit="min")
    name = "tasks"
    title = "Tasks"
    help = "A task is one unit of work with a life; a stop with one in hand is told to carry on, and its log is asked for as the edits mount."
    states = (Ready, Working, Impasse, ExternalWait)
    commands = (TaskCommand, WaitCommand, ImpasseCommand)
    options = (AUTO, FIRST_DELAY, TASK_REMINDER_INTERVAL, LOG_LIMIT, LOG_AGE_LIMIT)
    listeners = (ClearWaits, ReleaseWaits, WaitCycleCheck)
    conduct = (TasksConduct,)
    data = (TasksDataReader,)

    TASK_CONTINUATION = Nudge(name, "carry_on", "{{name}} is in hand, {{logged}}: carry on", repeat_interval=0)
    STOP_LOG_REQUEST = Nudge(name, "log_first_at_stop", "{{name}}, {{logged}}: log where it stands first", "{{log_command}} \"<where it stands>\"", repeat_interval=0)
    OPEN_TASK = Nudge(name, "task_still_open", "{{name}} is still open: log where it stands or finish it", repeat_interval=900)
    UNLOGGED_TASK = Nudge(name, "task_open_with_nothing_logged", "task {{n}} is open with nothing logged")
    NEXT_TASK = Nudge(name, "next_task_holds_the_stop", "tasks are open, and auto mode is on: task {{n}} next: {{title}}", "carry on with it", repeat_interval=0)
    POSTPONED_WORK = Nudge(name, "deferred_work_is_a_task", "work deferred in words, not filed: `journal task create` it")
    COMMIT_CLOSURE = Nudge(name, "closed_by_commit", "commit {{sha}} closed {{tasks}}")
    STOP_POLLING = Nudge(name, "stop_polling", "you ran the same check {{times}} times in a row: {{command}}", "wait for it instead of polling")
    LOG_REQUEST = Nudge(name, "log_where_it_stands", "{{edits}} edits since you logged {{name}}: say where it stands", "{{log}} \"<where it stands>\"", repeat_interval=0)
    LOG_EDIT_BLOCK = Nudge(name, "write_held_until_logged", "{{edits}} edits since you logged {{name}}", "{{log}} \"<what was decided or done, and why>\" before any other write", repeat_interval=0)
    CURRENT_TASK_REMINDER = Nudge(name, "task_in_hand_repeated", "{{name}} in hand, {{edits}} edits", "if this is not what you are doing, finish it or park it and start the work you are on", repeat_interval=0)
    SUSPENDED_TASKS = Nudge(name, "parked_tasks_still_open", "parked tasks, still open: {{tasks}}", "`journal task resume <n>` picks one up", repeat_interval=0)
    SUSPENDED_TASK_REMINDER = Nudge(name, "parked_task_asked_about", "task {{n}} is still parked: can you continue it now?", "it was parked because: {{why}}. `journal task resume {{n}}` picks it up again", repeat_interval=900)
    SUSPENDED_TASK_CLOSURE_REMINDER = Nudge(name, "parked_task_named_at_close", "task {{n}} is still parked: can you continue it now?", "it was parked because: {{why}}. `journal task resume {{n}}` picks it up again", repeat_interval=0)
    WAIT_CHECK = Nudge(name, "check_the_wait", "check {{what}} now: you have waited {{minutes}} min", "look at it. Still going: `journal await` again. Done or failed: log what came of it and take the next step", repeat_interval=300, blocks_regardless=True)
    IDLE_CHECK = Nudge(name, "check_in_after_quiet", "nothing has happened for half an hour: is there anything left for you to do?", "carry on, take the next task, or say so in one line", repeat_interval=1800)
    WAIT_END = Nudge(name, "wait_over", "the wait for {{what}} is over: {{outcome}}", repeat_interval=0)
    WAIT_NEXT_TASK = Nudge(name, "next_task_while_waiting", "while you wait for {{what}}, task {{n}}, {{title}} is next", "if you can work on it meanwhile, carry on with it; if you need what you wait for, end your turn", repeat_interval=0)
    TASK_REOPENED = Nudge(name, "task_reopened", "task {{n}} is open again: {{reason}}", "`journal task start {{n}}` takes it up", repeat_interval=0)
    BROKEN_WAIT = Nudge(name, "fix_the_broken_wait", "{{waits}}", "so it would wait forever: fix the command with `journal task block <n> --until \"<command>\"`, or `journal task unblock <n>`", repeat_interval=0)
    BLOCKED_TASK_REMINDER = Nudge(name, "blocked_task_asked_about", "blocked, with nothing that opens it by itself: {{tasks}}", "has what it waits on come? `journal task unblock <n>` when it has", repeat_interval=2700, blocks_regardless=True)
    nudges = (TASK_CONTINUATION, STOP_LOG_REQUEST, OPEN_TASK, UNLOGGED_TASK, NEXT_TASK, SUSPENDED_TASKS, POSTPONED_WORK, COMMIT_CLOSURE, STOP_POLLING, LOG_REQUEST, LOG_EDIT_BLOCK, CURRENT_TASK_REMINDER, SUSPENDED_TASK_REMINDER, SUSPENDED_TASK_CLOSURE_REMINDER, WAIT_CHECK, IDLE_CHECK, WAIT_END, WAIT_NEXT_TASK, TASK_REOPENED, BROKEN_WAIT, BLOCKED_TASK_REMINDER)

    skill = Skill("tasks", 'Declare, log and finish the work in hand; load it when you start or are asked to', """
# Tasks

A task is one unit of work with a life: open, started, done. Only one is in hand at a time. A quick edit
needs no task; file one for work that is an item of its own, that waits, or that the user should see tracked.

- `journal task create "<title>" --brief "<what and where to start>"` files one; add `--start` to take it at once, and
  `--from <message n>` when it comes from one of the user's messages.
- `journal task rename <n> "<title>"` says the title again when the first one was wrong; `journal task brief <n> "<what and
  done when>"` writes the brief anew, as when a plan's review changes a task. A revision is never written as a log line.
- `journal task start <n>` takes a task in hand. `journal task list` shows every task here. `journal task show <n>` reads
  one whole: its title, state, plan and phase, brief and every log line in order, so you pick it up where it stood.
- `journal task log <n> "<where it stands>"` after each step that matters; before a compaction, always.
- `journal task complete <n> --how "<outcome>"` finishes it. The output names the next open task.
- One task in hand at a time: a second start is refused until the first is done or parked. `journal task suspend <n> "<why>"`
  sets a started task aside for something else first; `journal task resume <n>` picks it up. Park for choice, never for being stuck.
- A task that waits on something outside your hands, a decision, an answer, a dependency, is blocked:
  `journal task block <n> "<what it waits on>"`. Blocked is neither offered nor nudged, only listed with its reason;
  `journal task unblock <n>` opens it again when what it waited on came. `journal task block <n> --on question:12`
  (or `--on task:7`) opens it by itself once that row is answered or closed; `--until "<command>"` runs the command
  every two minutes, such as a check that a pull request is merged, and opens it once the command passes; quote it in
  single quotes, so your shell keeps a `$(...)` in it for each run instead of filling it in once. Unblocking a task or a
  plan, by hand or by its wait, releases its waits and retires the check its block made.
- Waiting on something outside your hands: `journal await "<what you wait for>" --output <n>` for a command running in the
  background (add `--reader <name>` to watch it live while you wait), or `--until "<script>"`, run every 30 seconds, for anything else. The wait ends by itself once that is done,
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
""", keywords=('task', 'tasks', 'todo'), required_states=('working', 'stuck', 'awaiting'))
