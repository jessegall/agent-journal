from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.base.query.queries import Queries
from core.base.scope.actor_scope import ActorScope
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_dependency import TaskDependency
from core.modules.tasks.support.dependency_waits import DependencyWaits


class WaitingTaskListener(SaveListener[Changed[Task]]):
    """A task whose state or assignee changes may open what waits on it, or block it again."""

    name = "tasks.waiting-tasks"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, waits: DependencyWaits) -> None:
        self.queries, self.waits = queries, waits

    def handle(self, event: Changed[Task], context: Context) -> None:
        row, old_row = event.row, event.old_row
        if isinstance(event, Deleted) or (old_row is not None and (old_row.state, old_row.delegated_to) == (row.state, row.delegated_to)):
            return
        dependencies = self.queries.query(TaskDependency)
        for dependent in tuple(dependencies.filter(dependency_id=row.id).all_rows()):
            self.waits.update_wait(dependent.task_id, row.id, context)
        for dependency in tuple(dependencies.filter(task_id=row.id).all_rows()):
            self.waits.update_wait(row.id, dependency.dependency_id, context)
