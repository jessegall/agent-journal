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
    blocked_why: str = ""
    """What outside the agent's hands the task waits on; blocked is neither offered nor nudged, only listed."""

    def started(self, at: datetime) -> "Task":
        return self.with_(state=TaskState.STARTED, started_at=at, parked_why="", blocked_why="")

    def parked(self, why: str) -> "Task":
        return self.with_(state=TaskState.PARKED, parked_why=why)

    def blocked(self, why: str) -> "Task":
        return self.with_(state=TaskState.BLOCKED, blocked_why=why)

    def unblocked(self) -> "Task":
        return self.with_(state=TaskState.OPEN, blocked_why="")

    def finished(self, at: datetime, outcome: str) -> "Task":
        return self.with_(state=TaskState.DONE, finished_at=at, outcome=outcome)
