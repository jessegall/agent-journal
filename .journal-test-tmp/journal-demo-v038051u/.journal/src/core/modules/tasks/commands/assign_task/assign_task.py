from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class AssignTask(Command[Task]):
    task_id: int
    agent_id: int
