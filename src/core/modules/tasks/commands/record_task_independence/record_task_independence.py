from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.tasks.models.task import Task


@dataclass(frozen=True)
class RecordTaskIndependence(Command[Task]):
    """Records why a task truly waits on no other task."""

    task_id: int
    reason: str
