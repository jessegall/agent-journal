import re
from dataclasses import dataclass
from datetime import datetime
from typing import ClassVar

from journal.events.rows.row_resolved import RowResolved
from journal.events.rows.task_briefed import TaskBriefed
from journal.events.rows.task_closed import TaskClosed
from journal.events.rows.task_opened import TaskOpened
from journal.events.rows.task_reopened import TaskReopened
from journal.events.rows.task_wait_ended import TaskWaitEnded
from journal.events.rows.task_started import TaskStarted
from journal.models.scoped import Scoped
from journal.models.task_state import TaskState
from journal.support.rejection import Rejection


BULLET = re.compile(r"^\s*(?:[-*]|\d+[.)])\s+(.+)$", re.MULTILINE)

@dataclass(frozen=True)
class Task(Scoped):
    text_fields: ClassVar[tuple[str, ...]] = ("title", "brief", "outcome")

    title: str = ""
    brief: str = ""
    state: TaskState = TaskState.OPEN
    started_at: datetime | None = None
    finished_at: datetime | None = None
    outcome: str = ""
    suspension_reason: str = ""
    block_reason: str = ""

    def creation_events(self) -> tuple[TaskOpened, ...]:
        return (TaskOpened(environment_id=self.environment_id, title=self.title),) if self.state == TaskState.OPEN else ()

    def is_closed(self) -> bool:
        return self.state.is_closed()

    def is_newly_closed(self, prior_row: "Task | None") -> bool:
        return self.is_closed() and (prior_row is None or not prior_row.is_closed())

    def is_resolved(self) -> bool:
        return self.is_closed()

    def waiting_reason(self) -> str:
        return self.block_reason or self.suspension_reason

    def points(self) -> tuple[str, ...]:
        bullets = tuple(match[1].strip() for match in BULLET.finditer(self.brief))
        return bullets or (self.brief.strip(),)

    def briefed(self, brief: str, time: float) -> "Task":
        rewritten = self.with_(brief=brief)
        changes = tuple(n for n, point in enumerate(rewritten.points(), start=1) if n > len(self.points()) or self.points()[n - 1] != point)
        return rewritten.with_event(TaskBriefed(environment_id=self.environment_id, time=time, task_id=self.row_id, points=changes))

    def started(self, time: datetime) -> "Task":
        return self.plan_started(time, 0)

    def plan_started(self, time: datetime, plan_id: int) -> "Task":
        return self.with_(state=TaskState.STARTED, started_at=time, suspension_reason="", block_reason="").with_event(TaskStarted(environment_id=self.environment_id, time=time.timestamp(), task_id=self.row_id, title=self.title, plan_id=plan_id, prior_state=self.state))

    def suspended(self, reason: str, time: datetime) -> "Task":
        if self.state != TaskState.STARTED:
            raise Rejection(f"task {self.id} is {self.state}: only a started task is parked")
        return self.closed(self.with_(state=TaskState.SUSPENDED, suspension_reason=reason), time, "parked")

    def cancelled(self, time: datetime) -> "Task":
        return self.closed(self.with_(state=TaskState.CANCELLED, finished_at=self.finished_at or time), time, "cancelled")

    def closed(self, task: "Task", time: datetime, manner: str) -> "Task":
        return task.with_event(TaskClosed(environment_id=self.environment_id, time=time.timestamp(), task_id=self.row_id, outcome=manner)).with_event(RowResolved(environment_id=self.environment_id, time=time.timestamp(), ref=f"tasks:{self.id}"))

    def blocked(self, reason: str, time: datetime) -> "Task":
        if self.started_at is not None:
            raise Rejection(f"task {self.id} has started, so it is parked rather than blocked: journal task suspend {self.id} \"<why>\", with --on or --until when it waits on something")
        return self.closed(self.with_(state=TaskState.BLOCKED, block_reason=reason), time, "blocked")

    def wait_ended(self, reason: str, time: float) -> "Task":
        if self.state == TaskState.SUSPENDED:
            return self.with_event(TaskWaitEnded(environment_id=self.environment_id, time=time, task_id=self.row_id, reason=reason))
        return self.unblocked(reason, time)

    def unblocked(self, reason: str, time: float) -> "Task":
        return self.with_(state=TaskState.OPEN, block_reason="").with_event(TaskReopened(environment_id=self.environment_id, time=time, task_id=self.row_id, reason=reason))

    def finished(self, time: datetime, outcome: str) -> "Task":
        return self.closed(self.with_(state=TaskState.FINISHED, finished_at=time, outcome=outcome), time, "done")

    def title_words(self) -> str:
        return self.title

    def summary_line(self) -> str:
        return self.opening_line(self.brief)
