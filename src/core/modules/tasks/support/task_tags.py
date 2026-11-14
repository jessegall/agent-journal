from collections.abc import Sequence

from engine.command.context import Context
from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_tag import TaskTag
from engine.query.conditions.among import Among


TAGS_REASON = "the tags of the tasks asked about are read in one query"


class TaskTags:
    """Adds and removes task tags through their logged repository changes, and reads the words of many tasks in one
    kept query, so every reader of the same tasks in a request shares it."""

    def __init__(self, queries: Queries, repository: Repository, kept: KeptRows) -> None:
        self.queries, self.repository, self.kept = queries, repository, kept

    def words(self, task_ids: Sequence[int]) -> dict[int, list[str]]:
        tags = self.queries.query(TaskTag).matching(Among("task_id", list(task_ids)))
        tag_lists: dict[int, list[str]] = {task_id: [] for task_id in task_ids}
        for tag in self.kept.read(tags, lambda: tuple(tags.every_row(TAGS_REASON)), name="tasks.task_tags"):
            tag_lists[tag.task_id].append(tag.word)
        return tag_lists

    def add(self, task: Task, tags: Sequence[str], context: Context) -> None:
        existing = set(self.queries.query(TaskTag).filter(task_id=task.id).matching(Among("word", list(tags))).pluck("word", str)) if tags else set()
        for word in dict.fromkeys(tags):
            if word in existing:
                continue
            self.repository.save(TaskTag(task_id=task.id, word=word, creator_id=context.actor.id), context)

    def remove(self, task: Task, word: str, context: Context) -> None:
        tag = self.queries.query(TaskTag).filter(task_id=task.id, word=word).first()
        if tag is not None:
            self.repository.delete(tag, context)
