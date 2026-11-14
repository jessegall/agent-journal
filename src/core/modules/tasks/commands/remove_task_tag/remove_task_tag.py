from dataclasses import dataclass

from engine.command.command import Command
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class RemoveTaskTag(Command[Task]):
    """Removes a word from a task."""

    task: Task
    word: str
