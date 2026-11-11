from engine.event.moved import Moved
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.support.coding_main_options import CodingMainOptions
from suites.coding.support.main_caller import MainCaller


class TaskStartWithoutCodeGuard(Guard[Moved[Task]]):
    """A main agent that writes no code starts no task itself; the task goes to a worker."""

    name = "coding.main-starts-no-task-without-code"
    moves = tuple([TaskLifecycle.start])

    def __init__(self, caller: MainCaller, options: CodingMainOptions) -> None:
        self.caller, self.options = caller, options

    def check(self, event: Moved[Task], context: Context) -> None:
        if self.caller.is_main(context) and not self.options.options().writes_code:
            raise Refusal(f"task {event.row.id} goes to a worker", "the main agent writes no code here; leave it open for a worker")
