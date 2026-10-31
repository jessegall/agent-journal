from core.base.change.change import Change
from core.base.listener.deletion_listener import DeletionListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.query.conditions.equal import Equal
from core.base.repository.repository import Repository
from core.tasks.task_dependency import TaskDependency


class ForgetDependencies(DeletionListener):
    """Removes a task's dependencies, both ways, before the task is deleted, each removal logged as its own event."""

    name = "tasks.forget-dependencies"
    event = "task.delete"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, change: Change[Model]) -> None:
        task_id = change.row.id
        dependencies = self.queries.query(TaskDependency)
        for dependency in (*dependencies.matching(Equal("task_id", task_id)).all_rows(), *dependencies.matching(Equal("dependency_id", task_id)).all_rows()):
            self.repository.delete(dependency, change.context)
