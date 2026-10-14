from dataclasses import dataclass
from datetime import datetime

from journal.models.scoped import Scoped
from journal.models.task_state import TaskState


@dataclass(frozen=True)
class Task(Scoped):
    title: str = ""
    brief: str = ""
    state: TaskState = TaskState.OPEN
    started_at: datetime | None = None
    finished_at: datetime | None = None
    outcome: str = ""

    def started(self, at: datetime) -> "Task": ...

    def finished(self, at: datetime, outcome: str) -> "Task": ...
