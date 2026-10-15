from journal.features.feature import Feature
from journal.features.tasks.commands.halt_command import HaltCommand
from journal.features.tasks.commands.task_command import TaskCommand
from journal.features.tasks.listeners.ask_after_parked import AskAfterParked
from journal.features.tasks.listeners.check_in import CheckIn
from journal.features.tasks.listeners.name_parked_at_stop import NameParkedAtStop
from journal.features.tasks.listeners.offer_next import OfferNext
from journal.features.tasks.listeners.spot_polling import SpotPolling
from journal.features.nudge import Nudge
from journal.features.skill import Skill
from journal.features.tasks.states.expecting import Expecting
from journal.features.tasks.states.halted import Halted
from journal.features.tasks.states.idle import Idle
from journal.features.tasks.states.working import Working


class Tasks(Feature):
    name = "tasks"
    title = "Tasks"
    help = "A file write with no task started is refused; a stop with a task in hand is told to carry on."
    states = (Idle, Working, Halted, Expecting)
    commands = (TaskCommand, HaltCommand)
    listeners = (SpotPolling, AskAfterParked, NameParkedAtStop, OfferNext, CheckIn)

    DECLARE = Nudge(name, "declare", "no work declared: start a task before you write", "journal task start <n>, or journal task create \"<title>\" --start")
    CARRY_ON = Nudge(name, "carry_on", "task {{n}} is in hand: carry on", "log where it stands, then continue; journal halt \"<why>\" if you are truly stuck")
    OPEN = Nudge(name, "open", "task {{n}} is still open: log where it stands or finish it", repeat_after=900)
    UNLOGGED = Nudge(name, "unlogged", "task {{n}} is open with nothing logged")
    NEXT = Nudge(name, "next", "tasks are open, and auto mode is on: task {{n}} next: {{title}}", "sure you want to stop? carry on with it, or journal halt now \"<why>\" if you are truly stuck", repeat_after=0)
    PARKED_AT_STOP = Nudge(name, "parked_at_stop", "parked tasks, still open: {{rows}}", "journal task resume <n> picks one up; leave them parked only on purpose", repeat_after=0)
    DEFERRED = Nudge(name, "deferred", "work deferred in words, not filed: journal task create it")
    CLOSED_BY_COMMIT = Nudge(name, "closed_by_commit", "commit {{sha}} closed {{tasks}}")
    POLLING = Nudge(name, "polling", "you ran the same check {{times}} times in a row: {{command}}", "wait for it instead of polling")
    LOG_OVERDUE = Nudge(name, "log_overdue", "{{edits}} edits since task {{n}} was last logged", "journal task log {{n}} \"<what was decided or done, and why>\" before any other write", repeat_after=0)
    IN_HAND = Nudge(name, "in_hand", "task {{n}} in hand", "if this is not what you are doing, finish it or park it and start the task you are on", repeat_after=0)
    PARKED_STILL = Nudge(name, "parked_still", "task {{n}}, {{title}}, is still parked: can you continue it now?", "it was parked because: {{why}}. journal task resume {{n}} picks it up again", repeat_after=900)
    CHECK_AWAITED = Nudge(name, "check_awaited", "check {{what}} now: you have waited {{minutes}} min", "look at it. Still going: journal task await again. Done or failed: log what came of it and take the next step", repeat_after=300)
    CHECK_IN = Nudge(name, "check_in", "nothing has happened for {{minutes}} minutes: is there anything left for you to do?", "carry on, take the next task, or say so in one line", repeat_after=1800)
    nudges = (DECLARE, CARRY_ON, OPEN, UNLOGGED, NEXT, DEFERRED, CLOSED_BY_COMMIT, POLLING, LOG_OVERDUE, IN_HAND, PARKED_STILL, CHECK_AWAITED, CHECK_IN)

    skill = Skill("tasks", 'Declare, log and finish the work in hand; load it when you start or are asked to', """
# Tasks

A task is one unit of work with a life: open, started, done. Only one is in hand at a time, and a file
write with none started is refused.

- `journal task create "<title>" --brief "<what and where to start>"` files one; add `--start` to take it at once.
- `journal task start <n>` takes a task in hand. `journal task list` shows every task here.
- `journal task log <n> "<where it stands>"` after each step that matters; before a compaction, always.
- `journal task done <n> --how "<outcome>"` finishes it. The output names the next open task.
- One task in hand at a time: a second start is refused until the first is done or parked. `journal task park <n> "<why>"`
  sets it aside for something else first; `journal task resume <n>` picks it up. Park for choice, never for being stuck.
- Waiting on something outside your hands, a run or a person: `journal task await <n> "<what you wait for>"` and end
  your turn; working again lifts it, and every five quiet minutes you are asked to look.
- Twenty edits with nothing logged hold the next write until you log; every ten the task in hand is named back to you.
- A commit whose message carries `Journal: tasks done <n>` on a line of its own finishes task n.
- Auto mode (the setting tasks.auto, on by default) means you work the list: a stop with tasks open is answered with the next
  one, and only the user stops you. A stop with parked tasks names them, in auto mode or not: parked is still open.
- Work you put off in words is work lost: file it as a task instead.
- Stopping with a task in hand is told to carry on. Truly stuck: `journal halt now "<why>"`.
""", keywords=('task', 'tasks', 'todo'), required_in=('working', 'halted', 'expecting'))
