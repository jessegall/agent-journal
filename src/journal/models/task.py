from dataclasses import dataclass
from datetime import datetime

from journal.models.scoped import Scoped
from journal.models.task_state import TaskState
from journal.refused import Refused


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

    def is_closed(self) -> bool:
        return self.state.is_closed()

    def has_just_closed(self, was: "Task | None") -> bool:
        """Closed now, and open before this change."""
        return self.is_closed() and (was is None or not was.is_closed())

    def is_settled(self) -> bool:
        """Nothing waiting on it waits any longer."""
        return self.is_closed()

    def started(self, at: datetime) -> "Task":
        return self.with_(state=TaskState.STARTED, started_at=at, parked_why="", blocked_why="")

    def parked(self, why: str) -> "Task":
        """Put aside after it was started; a task never started is not parked, it is still open."""
        if self.state != TaskState.STARTED:
            raise Refused(f"task {self.id} is {self.state}: only a started task is parked")
        return self.with_(state=TaskState.PARKED, parked_why=why)

    def cancelled(self, at: datetime) -> "Task":
        """Given up: finished, with no outcome, so nothing counts it as open."""
        return self.with_(state=TaskState.CANCELLED, finished_at=self.finished_at or at)

    def blocked(self, why: str) -> "Task":
        return self.with_(state=TaskState.BLOCKED, blocked_why=why)

    def unblocked(self) -> "Task":
        return self.with_(state=TaskState.OPEN, blocked_why="")

    def finished(self, at: datetime, outcome: str) -> "Task":
        return self.with_(state=TaskState.DONE, finished_at=at, outcome=outcome)

    def mentioning_text(self) -> str | None:
        return f"{self.title}\n{self.brief}"
