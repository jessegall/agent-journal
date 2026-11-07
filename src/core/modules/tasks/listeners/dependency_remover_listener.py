from core.base.listener.deletion_listener import DeletionListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.query.conditions.equal import Equal
from core.base.repository.repository import Repository
from core.modules.tasks.models.task_dependency import TaskDependency
from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_waits import TaskWaits


class DependencyRemoverListener(DeletionListener[Deleted[Task]]):
    """Removes a task's dependencies, both ways, before the task is deleted, each removal logged as its
    own event."""

    name = "tasks.dependency-remover"

    def __init__(self, queries: Queries, repository: Repository, waits: TaskWaits) -> None:
        self.queries, self.repository, self.waits = queries, repository, waits

    def handle(self, event: Deleted[Task], context: Context) -> None:
        task_id = event.row.id
        for wait in self.waits.pending_task(task_id):
            self.repository.update(wait, context, ended_at=context.timestamp)
        dependencies = self.queries.query(TaskDependency)
        for dependency in (*dependencies.matching(Equal("task_id", task_id)).all_rows(), *dependencies.matching(Equal("dependency_id", task_id)).all_rows()):
            self.repository.delete(dependency, context)
