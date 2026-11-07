from core.base.guard.guard import Guard
from core.modules.tasks.models.task_dependency import TaskDependency
from core.modules.tasks.queries.task_query import TaskQuery
from core.base.change.created import Created
from core.base.command.context import Context


class VisibleDependencyGuard(Guard[Created[TaskDependency]]):
    """Refuses a dependency on a task of another environment, which the scope hides from the caller."""

    name = "tasks.visible-dependency"

    def __init__(self, tasks: TaskQuery) -> None:
        self.tasks = tasks

    def check(self, event: Created[TaskDependency], context: Context) -> None:
        self.tasks.find_many([event.row.task_id, event.row.dependency_id])
