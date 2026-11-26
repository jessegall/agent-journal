from dataclasses import dataclass

from engine.command.command import Command
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class TagTask(Command[Task]):
    """Adds subject words to a task."""

    task: Task
    tags: tuple[str, ...]
