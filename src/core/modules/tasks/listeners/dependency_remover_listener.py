from engine.listener.deletion_listener import DeletionListener
from engine.query.queries import Queries
from engine.query.conditions.equal import Equal
from engine.repository.repository import Repository
from core.modules.tasks.models.task_dependency import TaskDependency
from engine.change.deleted import Deleted
from engine.command.context import Context
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
