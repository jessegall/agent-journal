from journal.features.feature import Feature
from journal.features.tasks.commands.halt_command import HaltCommand
from journal.features.tasks.commands.task_command import TaskCommand
from journal.features.tasks.listeners.spot_polling import SpotPolling
from journal.features.nudge import Nudge
from journal.features.skill import Skill
from journal.features.tasks.states.halted import Halted
from journal.features.tasks.states.idle import Idle
from journal.features.tasks.states.working import Working


class Tasks(Feature):
    name = "tasks"
    title = "Tasks"
    states = (Idle, Working, Halted)
    commands = (TaskCommand, HaltCommand)
    listeners = (SpotPolling,)

    DECLARE = Nudge(name, "declare", "no work declared: start a task before you write", "journal task start <n>, or journal task create \"<title>\" --start")
    CARRY_ON = Nudge(name, "carry_on", "task {{n}} is in hand: carry on", "log where it stands, then continue; journal halt \"<why>\" if you are truly stuck")
    OPEN = Nudge(name, "open", "task {{n}} is still open: log where it stands or finish it", repeat_after=900)
    UNLOGGED = Nudge(name, "unlogged", "task {{n}} is open with nothing logged")
    LOG_FIRST = Nudge(name, "log_first", "context is about to be compacted: log where task {{n}} stands")
    NEXT = Nudge(name, "next", "task {{n}} next: {{title}}", repeat_after=0)
    DEFERRED = Nudge(name, "deferred", "work deferred in words, not filed: journal task create it")
    CLOSED_BY_COMMIT = Nudge(name, "closed_by_commit", "commit {{sha}} closed {{tasks}}")
    POLLING = Nudge(name, "polling", "you ran the same check {{times}} times in a row: {{command}}", "wait for it instead of polling")
    nudges = (DECLARE, CARRY_ON, OPEN, UNLOGGED, LOG_FIRST, NEXT, DEFERRED, CLOSED_BY_COMMIT, POLLING)

    skill = Skill("tasks", 'Declare, log and finish the work in hand; load it when you start or are asked to', """
# Tasks

A task is one unit of work with a life: open, started, done. Only one is in hand at a time, and a file
write with none started is refused.

- `journal task create "<title>" --brief "<what and where to start>"` files one; add `--start` to take it at once.
- `journal task start <n>` takes a task in hand. `journal task list` shows every task here.
- `journal task log <n> "<where it stands>"` after each step that matters; before a compaction, always.
- `journal task done <n> --how "<outcome>"` finishes it. The output names the next open task.
- Work you put off in words is work lost: file it as a task instead.
- Stopping with a task in hand is told to carry on. Truly stuck: `journal halt now "<why>"`.
""", keywords=('task', 'tasks', 'todo'), required_in=('working', 'halted'))
