from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.tasks.support.task_tag_confirmation import TaskTagConfirmation
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class TagTask(Command[Task], TaskTagConfirmation):
    """Adds subject words to a task."""

    task: Task
    tags: tuple[str, ...]
    confirmed_tags: bool = False
