from journal.features.feature import Feature
from journal.features.tasks.commands.halt_command import HaltCommand
from journal.features.tasks.commands.task_command import TaskCommand
from journal.features.tasks.listeners.spot_polling import SpotPolling
from journal.features.nudge import Nudge
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
