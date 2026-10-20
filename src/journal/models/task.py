from dataclasses import dataclass
from datetime import datetime
from typing import ClassVar

from journal.events.rows.row_settled import RowSettled
from journal.events.rows.task_closed import TaskClosed
from journal.events.rows.task_opened_again import TaskOpenedAgain
from journal.events.rows.task_started import TaskStarted
from journal.models.scoped import Scoped
from journal.models.task_state import TaskState
from journal.support.refused import Refused


@dataclass(frozen=True)
class Task(Scoped):
    text_fields: ClassVar[tuple[str, ...]] = ("title", "brief", "outcome")

    title: str = ""
    brief: str = ""
    state: TaskState = TaskState.OPEN
    started_at: datetime | None = None
    finished_at: datetime | None = None
    outcome: str = ""
    parked_why: str = ""
    blocked_why: str = ""

    def is_closed(self) -> bool:
        return self.state.is_closed()

    def has_just_closed(self, was: "Task | None") -> bool:
        return self.is_closed() and (was is None or not was.is_closed())

    def is_settled(self) -> bool:
        return self.is_closed()

    def started(self, at: datetime) -> "Task":
        return self.started_by_plan(at, 0)

    def started_by_plan(self, at: datetime, plan_id: int) -> "Task":
        return self.with_(state=TaskState.STARTED, started_at=at, parked_why="", blocked_why="").with_event(TaskStarted(environment_id=self.environment_id, at=at.timestamp(), task_id=self.id, title=self.title, plan_id=plan_id))

    def parked(self, why: str, at: datetime) -> "Task":
        if self.state != TaskState.STARTED:
            raise Refused(f"task {self.id} is {self.state}: only a started task is parked")
        return self.closed(self.with_(state=TaskState.PARKED, parked_why=why), at, "parked")

    def cancelled(self, at: datetime) -> "Task":
        return self.closed(self.with_(state=TaskState.CANCELLED, finished_at=self.finished_at or at), at, "cancelled")

    def closed(self, task: "Task", at: datetime, how: str) -> "Task":
        return task.with_event(TaskClosed(environment_id=self.environment_id, at=at.timestamp(), task_id=self.id, how=how)).with_event(RowSettled(environment_id=self.environment_id, at=at.timestamp(), ref=f"tasks:{self.id}"))

    def blocked(self, why: str) -> "Task":
        return self.with_(state=TaskState.BLOCKED, blocked_why=why)

    def unblocked(self, on: str, at: float) -> "Task":
        return self.with_(state=TaskState.OPEN, blocked_why="").with_event(TaskOpenedAgain(environment_id=self.environment_id, at=at, task_id=self.id, on=on))

    def finished(self, at: datetime, outcome: str) -> "Task":
        return self.closed(self.with_(state=TaskState.DONE, finished_at=at, outcome=outcome), at, "done")

