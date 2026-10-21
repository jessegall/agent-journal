from typing import ClassVar
from dataclasses import dataclass

from journal.events.rows.worker_reported import WorkerReported
from journal.events.rows.worker_dispatched import WorkerDispatched
from journal.events.rows.worker_stopped import WorkerStopped
from journal.models.scoped import Scoped
from journal.models.worker_state import WorkerState


@dataclass(frozen=True)
class Worker(Scoped):
    """An agent sent to write one bounded job, in a worktree of its own when it changes code. A subagent only reads; a worker writes."""

    text_fields: ClassVar[tuple[str, ...]] = ("name", "brief")
    name: str = ""
    brief: str = ""
    provider: str = "claude"
    model: str = ""
    profile: str | None = None
    worktree: bool = False
    state: WorkerState = WorkerState.DISPATCHED
    session: str = ""
    dispatched_by: str = ""
    resume: str = ""
    taken_up: bool = False
    pid: int = 0
    began: float = 0.0
    found_session: str = ""

    def dispatched(self, time: float) -> "Worker":
        return self.with_(state=WorkerState.DISPATCHED).with_event(WorkerDispatched(environment_id=self.environment_id, time=time, worker_id=self.id, name=self.name, dispatched_by=self.dispatched_by))

    def reported(self, time: float, report: int) -> "Worker":
        return self.with_(state=WorkerState.REPORTED, taken_up=False, pid=0).with_event(WorkerReported(environment_id=self.environment_id, time=time, worker_id=self.id, name=self.name, report=report, dispatched_by=self.dispatched_by))

    def running_as(self, pid: int, began: float) -> "Worker":
        return self.with_(pid=pid, began=began, found_session="")

    def told(self, brief: str) -> "Worker":
        return self.with_(brief=brief, state=WorkerState.DISPATCHED)

    def stopped(self, time: float) -> "Worker":
        return self.with_(state=WorkerState.STOPPED, taken_up=True).with_event(WorkerStopped(environment_id=self.environment_id, time=time, worker_id=self.id, name=self.name))

    def done(self) -> "Worker":
        return self.with_(taken_up=True)

    def is_out(self) -> bool:
        return self.state == WorkerState.DISPATCHED

    def has_report_waiting(self) -> bool:
        return self.state == WorkerState.REPORTED and not self.taken_up

    def title_words(self) -> str:
        return self.name

    def summary_line(self) -> str:
        return self.first_line(self.brief)
