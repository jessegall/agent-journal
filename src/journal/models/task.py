from dataclasses import dataclass
from datetime import datetime
from typing import ClassVar

from journal.events.rows.row_resolved import RowResolved
from journal.events.rows.task_closed import TaskClosed
from journal.events.rows.task_reopened import TaskReopened
from journal.events.rows.task_started import TaskStarted
from journal.models.scoped import Scoped
from journal.models.task_state import TaskState
from journal.support.rejection import Rejection


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

    def is_newly_closed(self, prior_row: "Task | None") -> bool:
        return self.is_closed() and (prior_row is None or not prior_row.is_closed())

    def is_resolved(self) -> bool:
        return self.is_closed()

    def started(self, time: datetime) -> "Task":
        return self.plan_started(time, 0)

    def plan_started(self, time: datetime, plan_id: int) -> "Task":
        return self.with_(state=TaskState.STARTED, started_at=time, parked_why="", blocked_why="").with_event(TaskStarted(environment_id=self.environment_id, time=time.timestamp(), task_id=self.id, title=self.title, plan_id=plan_id))

    def suspended(self, reason: str, time: datetime) -> "Task":
        if self.state != TaskState.STARTED:
            raise Rejection(f"task {self.id} is {self.state}: only a started task is parked")
        return self.closed(self.with_(state=TaskState.SUSPENDED, parked_why=reason), time, "parked")

    def cancelled(self, time: datetime) -> "Task":
        return self.closed(self.with_(state=TaskState.CANCELLED, finished_at=self.finished_at or time), time, "cancelled")

    def closed(self, task: "Task", time: datetime, manner: str) -> "Task":
        return task.with_event(TaskClosed(environment_id=self.environment_id, time=time.timestamp(), task_id=self.id, how=manner)).with_event(RowResolved(environment_id=self.environment_id, time=time.timestamp(), ref=f"tasks:{self.id}"))

    def blocked(self, reason: str, time: datetime) -> "Task":
        return self.closed(self.with_(state=TaskState.BLOCKED, blocked_why=reason), time, "blocked")

    def unblocked(self, enabled: str, time: float) -> "Task":
        return self.with_(state=TaskState.OPEN, blocked_why="").with_event(TaskReopened(environment_id=self.environment_id, time=time, task_id=self.id, on=enabled))

    def finished(self, time: datetime, outcome: str) -> "Task":
        return self.closed(self.with_(state=TaskState.FINISHED, finished_at=time, outcome=outcome), time, "done")

    def title_words(self) -> str:
        return self.title

    def summary_line(self) -> str:
        return self.first_line(self.brief)
