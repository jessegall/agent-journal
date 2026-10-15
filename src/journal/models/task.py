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
    parked_why: str = ""

    def started(self, at: datetime) -> "Task":
        return self.with_(state=TaskState.STARTED, started_at=at, parked_why="")

    def parked(self, why: str) -> "Task":
        return self.with_(state=TaskState.PARKED, parked_why=why)

    def finished(self, at: datetime, outcome: str) -> "Task":
        return self.with_(state=TaskState.DONE, finished_at=at, outcome=outcome)
