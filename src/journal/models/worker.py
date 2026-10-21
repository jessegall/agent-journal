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
    dispatcher: str = ""
    resume: str = ""
    adopted: bool = False
    pid: int = 0
    began: float = 0.0
    recovered_session: str = ""

    def worker_ref(self) -> str:
        return f"{self.table()}:{self.id}"

    def dispatched(self, time: float) -> "Worker":
        return self.with_(state=WorkerState.DISPATCHED).with_event(WorkerDispatched(environment_id=self.environment_id, time=time, worker_id=self.id, name=self.name, ref=self.worker_ref(), label=f"worker {self.id}", awaiter=self.dispatcher))

    def reported(self, time: float, report: int) -> "Worker":
        return self.with_(state=WorkerState.REPORTED, adopted=False, pid=0).with_event(WorkerReported(environment_id=self.environment_id, time=time, worker_id=self.id, name=self.name, report=report, dispatcher=self.dispatcher, ref=self.worker_ref(), outcome=f"worker {self.id}, {self.name}, reported"))

    def running_as(self, pid: int, began: float) -> "Worker":
        return self.with_(pid=pid, began=began, recovered_session="")

    def instructed(self, brief: str) -> "Worker":
        return self.with_(brief=brief, state=WorkerState.DISPATCHED)

    def stopped(self, time: float) -> "Worker":
        return self.with_(state=WorkerState.STOPPED, adopted=True).with_event(WorkerStopped(environment_id=self.environment_id, time=time, worker_id=self.id, name=self.name, dispatcher=self.dispatcher, ref=self.worker_ref(), outcome=f"worker {self.id}, {self.name}, stopped before it reported"))

    def finished(self) -> "Worker":
        return self.with_(adopted=True)

    def is_running(self) -> bool:
        return self.state == WorkerState.DISPATCHED

    def has_report_waiting(self) -> bool:
        return self.state == WorkerState.REPORTED and not self.adopted

    def title_words(self) -> str:
        return self.name

    def summary_line(self) -> str:
        return self.first_line(self.brief)
