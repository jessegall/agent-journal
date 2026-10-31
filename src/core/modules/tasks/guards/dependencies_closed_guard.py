from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.tasks.models.open_dependency import OpenDependency


class DependenciesClosedGuard(Guard):
    """Refuses to start a task that waits on a task not yet closed."""

    name = "tasks.dependencies-closed"
    event = "task.start"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, change: Change[Model]) -> None:
        waiting = self.queries.query(OpenDependency).filter(task_id=change.row.id).ordered("dependency_id").page(1, 1).rows
        if waiting:
            raise Refusal(f"task {change.row.id} waits on open task {waiting[0].dependency_id}",
                          f"finish task {waiting[0].dependency_id} first, or stop waiting with journal task remove-dependency {change.row.id} --on {waiting[0].dependency_id}")
