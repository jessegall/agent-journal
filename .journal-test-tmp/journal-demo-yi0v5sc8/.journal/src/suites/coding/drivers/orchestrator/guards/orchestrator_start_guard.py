from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.base.change.moved import Moved
from core.base.command.context import Context
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task


class OrchestratorStartGuard(Guard[Moved[Task]]):
    """An agent the orchestrator drives starts no task itself; every task goes to a worker."""

    name = "coding.orchestrator-starts-no-task"
    moves = tuple([TaskLifecycle.start])

    def check(self, event: Moved[Task], context: Context) -> None:
        raise Refusal(f"task {event.row.id} goes to a worker", "leave it open for a worker, or choose the builder with journal driver choose coding.builder")
