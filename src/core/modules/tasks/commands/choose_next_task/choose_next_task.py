from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class ChooseNextTask(Command[Task]):
    """Marks the one task an agent is given next, before anything the task assigner would pick."""

    task_id: int
    agent_id: int | None = None
