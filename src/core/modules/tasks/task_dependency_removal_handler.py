from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.tasks.task_dependency_removal import TaskDependencyRemoval
from core.modules.tasks.task_dependency import TaskDependency


class TaskDependencyRemovalHandler(Handler[TaskDependencyRemoval, None]):
    """Finds the dependency of one task on another and deletes it."""

    command = TaskDependencyRemoval

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: TaskDependencyRemoval, context: Context) -> None:
        rows = self.queries.query(TaskDependency).filter(task_id=command.task_id, dependency_id=command.dependency_id).page(1, 1).rows
        if not rows:
            raise Refusal(f"task {command.task_id} does not wait on task {command.dependency_id}", f"journal task-dependency list --task {command.task_id}")
        self.repository.delete(rows[0], context)
