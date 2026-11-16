from engine.event.moved import Moved
from engine.command.context import Context
from engine.guard.guard import Guard
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from core.modules.drivers.support.command_check import CommandCheck
from core.modules.tasks.commands.start_task.start_task import StartTask


class TaskStartCodeGuard(Guard[Moved[Task]]):
    """A main agent that writes no code starts no task itself; the task goes to a worker."""

    name = "coding.main-starts-no-task-without-code"
    moves = (TaskLifecycle.start,)

    def __init__(self, start_check: CommandCheck) -> None:
        self.start_check = start_check

    # the task's start asks the hook's policy, coding.main-writes-no-code, at its entry point (doc 1310 section 10.9)
    def check(self, event: Moved[Task], context: Context) -> None:
        if self.start_check.answers(context):
            self.start_check.admit(StartTask, context)
