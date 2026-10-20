from typing import ClassVar
from dataclasses import dataclass

from journal.events.rows.worker_back import WorkerBack
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
    """The provider's own session of its last run, so its next job is given to the same worker with its memory."""
    taken_up: bool = False
    pid: int = 0
    began: float = 0.0
    found_session: str = ""

    def reported(self, at: float) -> "Worker":
        return self.with_(state=WorkerState.REPORTED, taken_up=False, pid=0).with_event(WorkerBack(environment_id=self.environment_id, at=at, worker_id=self.id))

    def running_as(self, pid: int, began: float) -> "Worker":
        return self.with_(pid=pid, began=began, found_session="")

    def told(self, brief: str) -> "Worker":
        return self.with_(brief=brief, state=WorkerState.DISPATCHED)

    def stopped(self) -> "Worker":
        return self.with_(state=WorkerState.STOPPED, taken_up=True)

    def done(self) -> "Worker":
        return self.with_(taken_up=True)

    def is_out(self) -> bool:
        return self.state == WorkerState.DISPATCHED

    def has_report_waiting(self) -> bool:
        return self.state == WorkerState.REPORTED and not self.taken_up
