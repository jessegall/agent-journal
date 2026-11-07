from collections.abc import Sequence

from core.base.command.context import Context
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_tag import TaskTag


class TaskTags:
    """Adds and removes task tags through their logged repository changes."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def add(self, task: Task, tags: Sequence[str], context: Context) -> None:
        for word in dict.fromkeys(tags):
            if self.queries.query(TaskTag).filter(task_id=task.id, word=word).exists():
                continue
            self.repository.save(TaskTag(task_id=task.id, word=word, creator_id=context.actor.id), context)

    def remove(self, task: Task, word: str, context: Context) -> None:
        tag = self.queries.query(TaskTag).filter(task_id=task.id, word=word).first()
        if tag is not None:
            self.repository.delete(tag, context)
