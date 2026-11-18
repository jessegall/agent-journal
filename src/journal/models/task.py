import re
from dataclasses import dataclass
from datetime import datetime
from typing import ClassVar

from journal.events.rows.row_resolved import RowResolved
from journal.events.rows.task_edited import TaskEdited
from journal.events.rows.task_closed import TaskClosed
from journal.events.rows.task_arrived import TaskArrived
from journal.events.rows.task_transferred import TaskTransferred
from journal.events.rows.task_test_failed import TaskTestFailed
from journal.support.timespan import Timespan
from journal.events.rows.task_opened import TaskOpened
from journal.events.rows.task_reopened import TaskReopened
from journal.events.rows.released_tasks import ReleasedTasks
from journal.events.rows.task_released import TaskReleased
from journal.events.rows.task_delegated import TaskDelegated
from journal.events.rows.task_started import TaskStarted
from journal.models.scoped import Scoped
from journal.support.task_priority import NORMAL
from journal.models.task_state import TaskState
from journal.support.rejection import Rejection
from journal.models.support.commentable import Commentable


BULLET = re.compile(r"^\s*(?:[-*]|\d+[.)])\s+(.+)$", re.MULTILINE)
INLINE_POINTS = re.compile(r"\bpoints:\s*(.+)$", re.IGNORECASE | re.DOTALL)
POINT_NUMBER = re.compile(r"(?:^|(?<=\s))(\d+)[.)]\s+")
# how a task's close names a block, the agent's own or one made by starting another task
BLOCKED_OUTCOME = "blocked"
# how the outcome of a request its recipient turned down begins: the task is cancelled, since a task has no declined state

@dataclass(frozen=True)
class Task(Scoped, Commentable):
    text_fields: ClassVar[tuple[str, ...]] = ("title", "brief", "outcome")

    title: str = ""
    brief: str = ""
    priority: int = NORMAL
    state: TaskState = TaskState.OPEN
    started_at: datetime | None = None
    completed_at: datetime | None = None
    outcome: str = ""
    block_reason: str = ""
    driver: str = ""
    driver_agent: str = ""
    delegated: bool = False
    priority_set: bool = False
    manual: bool = False
    tool_uses: int = 0

    def creation_events(self) -> tuple[TaskOpened, ...]:
        return (TaskOpened(environment_id=self.environment_id, title=self.title),) if self.is_open() else ()

    def is_closed(self) -> bool:
        return self.state.is_closed()

    def is_started(self) -> bool:
        return self.state == TaskState.STARTED

    def is_newly_closed(self, prior_row: "Task | None") -> bool:
        return self.is_closed() and (prior_row is None or not prior_row.is_closed())

    def is_resolved(self) -> bool:
        return self.is_closed()

    def is_assignable(self) -> bool:
        return self.is_open() and not self.delegated and bool(self.brief.strip())

    def waiting_reason(self) -> str:
        return self.block_reason

    def points(self) -> tuple[str, ...]:
        bullets = tuple(match[1].strip() for match in BULLET.finditer(self.brief))
        return bullets or self.inline_points() or (self.brief.strip(),)

    def inline_points(self) -> tuple[str, ...]:
        listing = INLINE_POINTS.search(self.brief)
        segments = POINT_NUMBER.split(listing[1]) if listing else []
        numbers, texts = segments[1::2], segments[2::2]
        if not numbers or numbers != [str(n) for n in range(1, len(numbers) + 1)]:
            return ()
        return tuple(text.strip().rstrip(";").strip() for text in texts)

    def edited(self, title: str, brief: str, time: float) -> "Task":
        rewritten = self.with_(title=title, brief=brief)
        changes = tuple(name for name, old_value, new_value in (("title", self.title, title), ("brief", self.brief, brief)) if old_value != new_value)
        if not changes:
            return rewritten
        points = tuple(n for n, point in enumerate(rewritten.points(), start=1) if n > len(self.points()) or self.points()[n - 1] != point)
        return rewritten.with_event(TaskEdited(environment_id=self.environment_id, time=time, task_id=self.row_id, changes=changes, points=points))

    def started(self, time: datetime) -> "Task":
        return self.plan_started(time, 0)

    def plan_started(self, time: datetime, plan_id: int) -> "Task":
        event = TaskStarted(environment_id=self.environment_id, time=time.timestamp(), task_id=self.row_id, title=self.title, plan_id=plan_id, prior_state=self.state)
        return self.with_(state=TaskState.STARTED, started_at=self.started_at or time, block_reason="").with_event(event)

    def prioritised(self, level: int) -> "Task":
        return self.with_(priority=level, priority_set=True)

    def priority_confirmed(self) -> "Task":
        return self.with_(priority_set=True)

    def kept_by_hand(self) -> "Task":
        return self.with_(manual=True)

    def left_to_the_journal(self) -> "Task":
        return self.with_(manual=False)

    def delegate(self, time: datetime) -> "Task":
        event = TaskDelegated(environment_id=self.environment_id, time=time.timestamp(), task_id=self.row_id, title=self.title, brief=self.brief)
        return self.with_(state=TaskState.OPEN, delegated=True, block_reason="").with_event(event)

    def worker_started(self, time: datetime) -> "Task":
        return self.with_(state=TaskState.STARTED, delegated=True, started_at=self.started_at or time, block_reason="")

    def released(self, time: float, group: ReleasedTasks | None = None) -> "Task":
        return self.with_(state=TaskState.OPEN, delegated=False, block_reason="").with_event(TaskReleased(environment_id=self.environment_id, time=time, task_id=self.row_id, reason="its worker let it go", group=group))

    def transferred(self, environment_id: int, source: str, destination: str, time: datetime) -> "Task":
        transfer_event = TaskTransferred(environment_id=self.environment_id, time=time.timestamp(), task_id=self.row_id, destination=destination)
        arrival_event = TaskArrived(environment_id=environment_id, time=time.timestamp(), task_id=self.row_id, title=self.title, source=source, state=self.state)
        return self.with_(environment_id=environment_id).with_event(transfer_event).with_event(arrival_event)

    def is_active(self) -> bool:
        return self.is_started() or self.is_testing()

    def reopened(self, time: datetime) -> "Task":
        return self.closed(self.with_(state=TaskState.OPEN), time, "set aside")

    def cancelled(self, time: datetime, outcome: str) -> "Task":
        return self.closed(self.with_(state=TaskState.CANCELLED, completed_at=self.completed_at or time, outcome=outcome), time, "cancelled")

    def closed(self, task: "Task", time: datetime, manner: str, worker_id: int = 0) -> "Task":
        return task.with_event(TaskClosed(environment_id=self.environment_id, time=time.timestamp(), task_id=self.row_id, outcome=manner, worker_id=worker_id)).with_event(RowResolved(environment_id=self.environment_id, time=time.timestamp(), ref=f"tasks:{self.id}"))

    def testing(self, time: datetime) -> "Task":
        if not self.is_started():
            raise Rejection(f"task {self.id} is {self.state}: only a started task waits in testing")
        return self.closed(self.with_(state=TaskState.TESTING), time, "testing")

    def test_passed(self, time: datetime, outcome: str) -> "Task":
        return self.completed(time, f"tested: {outcome}")

    def test_failed(self, time: datetime, output_id: int, outcome: str) -> "Task":
        event = TaskTestFailed(environment_id=self.environment_id, time=time.timestamp(), task_id=self.row_id, output_id=output_id, outcome=outcome)
        return self.with_(state=TaskState.BLOCKED, block_reason=f"its test run failed: {outcome}").with_event(event)

    def tool_used(self) -> "Task":
        return self.with_(tool_uses=self.tool_uses + 1)

    def progress_span(self, moment: float) -> Timespan:
        return Timespan(self.tool_uses, moment - self.started_at.timestamp()) if self.started_at else Timespan()

    def is_testing(self) -> bool:
        return self.state == TaskState.TESTING

    def blocked(self, reason: str, time: datetime) -> "Task":
        return self.closed(self.with_(state=TaskState.BLOCKED, block_reason=reason), time, BLOCKED_OUTCOME)

    def unblocked(self, reason: str, time: float) -> "Task":
        return self.with_(state=TaskState.OPEN, block_reason="").with_event(TaskReopened(environment_id=self.environment_id, time=time, task_id=self.row_id, reason=reason))

    def completed(self, time: datetime, outcome: str) -> "Task":
        return self.closed(self.with_(state=TaskState.COMPLETED, completed_at=time, outcome=outcome), time, "completed")

    def merge_completed(self, time: datetime, outcome: str, worker_id: int) -> "Task":
        return self.closed(self.with_(state=TaskState.COMPLETED, completed_at=time, outcome=outcome), time, "completed", worker_id)

    def title_words(self) -> str:
        return self.title

    def summary_line(self) -> str:
        return self.opening_line(self.brief)

    def is_open(self) -> bool:
        return self.state == TaskState.OPEN

    def is_completed(self) -> bool:
        return self.state == TaskState.COMPLETED

