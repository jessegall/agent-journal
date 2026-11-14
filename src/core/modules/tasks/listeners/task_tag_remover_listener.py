from engine.event.deleted import Deleted
from engine.command.context import Context
from engine.listener.deletion_listener import DeletionListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_tag import TaskTag

REMOVED_TAGS_REASON = "a deleted task takes every tag it carries with it"


class TaskTagRemoverListener(DeletionListener[Deleted[Task]]):
    """Deletes a task's tags before the task, recording each deletion."""

    name = "tasks.tag-remover"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Deleted[Task], context: Context) -> None:
        for tag in self.queries.query(TaskTag).filter(task_id=event.row.id).every_row(REMOVED_TAGS_REASON):
            self.repository.delete(tag, context)
