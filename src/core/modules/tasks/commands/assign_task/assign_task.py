from dataclasses import dataclass

from engine.command.command import Command
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class AssignTask(Command[Task]):
    """Gives a task to an actor: a person or an agent."""

    task_id: int
    actor_id: int
