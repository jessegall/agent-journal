from dataclasses import dataclass
from typing import ClassVar

from journal.events.rows.task_logged import TaskLogged
from journal.models.scoped import Scoped
from journal.models.task import Task


@dataclass(frozen=True)
class TaskLog(Scoped):
    text_fields: ClassVar[tuple[str, ...]] = ("line",)

    task_id: int = 0
    line: str = ""

    @classmethod
    def of(cls, task: Task, line: str, at: float) -> "TaskLog":
        return cls(environment_id=task.environment_id, task_id=task.id, line=line).with_event(TaskLogged(environment_id=task.environment_id, at=at, task_id=task.id))

