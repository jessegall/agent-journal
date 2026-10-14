from dataclasses import dataclass
from datetime import datetime
from enum import StrEnum

from journal.models.base import Scoped


class TaskState(StrEnum):
    OPEN = "open"
    STARTED = "started"
    DONE = "done"


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


@dataclass(frozen=True)
class TaskLog(Scoped):
    task_id: int = 0
    line: str = ""
