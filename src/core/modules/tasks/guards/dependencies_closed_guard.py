from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.tasks.models.open_dependency import OpenDependency
from core.base.change.moved import Moved
from core.base.command.context import Context
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task


class DependenciesClosedGuard(Guard[Moved[Task]]):
    """Refuses to start a task that waits on a task not yet closed."""

    name = "tasks.dependencies-closed"
    moves = tuple([TaskLifecycle.start])

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Moved[Task], context: Context) -> None:
        waiting = self.queries.query(OpenDependency).filter(task_id=event.row.id).ordered("dependency_id").first()
        if waiting is not None:
            raise Refusal(f"task {event.row.id} waits on open task {waiting.dependency_id}",
                          f"finish task {waiting.dependency_id} first, or stop waiting with journal task remove-dependency {event.row.id} --on {waiting.dependency_id}")
