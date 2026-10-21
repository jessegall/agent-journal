from typing import ClassVar
from dataclasses import dataclass

from journal.events.rows.worker_reported import WorkerReported
from journal.events.rows.worker_dispatched import WorkerDispatched
from journal.events.rows.worker_stopped import WorkerStopped
from journal.events.rows.worker_notified import WorkerNotified
from journal.events.rows.worker_retired import WorkerRetired
from journal.events.rows.worker_reused import WorkerReused
from journal.events.rows.worker_revived import WorkerRevived
from journal.models.scoped import Scoped
from journal.models.worker_state import WorkerState


@dataclass(frozen=True)
class Worker(Scoped):
    """An agent sent to write one bounded job, in a worktree of its own when it changes code: out while dispatched whatever its process, so one ended unreported or mid-report still counts as out until its report is filed; idle once it reported, until its report is acted on; retired once stopped or acted on."""

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
    touched_paths: tuple[str, ...] | None = None
    reuse_count: int = 0
    retire_reason: str = ""

    def worker_ref(self) -> str:
        return f"{self.table()}:{self.id}"

    def dispatched(self, time: float) -> "Worker":
        return self.with_(state=WorkerState.DISPATCHED).with_event(self.pending(WorkerDispatched, time))

    def pending(self, kind: type[WorkerDispatched], time: float) -> WorkerDispatched:
        return kind(environment_id=self.environment_id, time=time, worker_id=self.id, name=self.name, ref=self.worker_ref(), label=f"worker {self.id}", awaiter=self.dispatcher, brief=self.brief)

    def reported(self, time: float, report: int) -> "Worker":
        return self.with_(state=WorkerState.REPORTED, adopted=False, pid=0).with_event(WorkerReported(environment_id=self.environment_id, time=time, worker_id=self.id, name=self.name, report=report, dispatcher=self.dispatcher, ref=self.worker_ref(), outcome=f"worker {self.id}, {self.name}, reported"))

    def running_as(self, pid: int, began: float) -> "Worker":
        return self.with_(pid=pid, began=began, recovered_session="")

    def reused(self, brief: str, time: float) -> "Worker":
        instructed = self.instructed(brief).with_(reuse_count=self.reuse_count + 1)
        return instructed.with_event(instructed.pending(WorkerReused, time))

    def revived(self, brief: str, time: float) -> "Worker":
        instructed = self.instructed(brief).with_(reuse_count=self.reuse_count + 1)
        return instructed.with_event(instructed.pending(WorkerRevived, time))

    def instructed(self, brief: str) -> "Worker":
        return self.with_(brief=brief, state=WorkerState.DISPATCHED, adopted=False, pid=0, began=0.0)

    def notified(self, text: str, time: float) -> "Worker":
        return self.with_event(WorkerNotified(environment_id=self.environment_id, time=time, worker_id=self.id, name=self.name, dispatcher=self.dispatcher, text=text))

    def stopped(self, time: float, reason: str) -> "Worker":
        return self.with_(state=WorkerState.STOPPED, adopted=True, retire_reason=reason).with_event(WorkerStopped(environment_id=self.environment_id, time=time, worker_id=self.id, name=self.name, dispatcher=self.dispatcher, ref=self.worker_ref(), outcome=f"worker {self.id}, {self.name}, stopped before it reported"))

    def finished(self, time: float, reason: str) -> "Worker":
        return self.with_(adopted=True, retire_reason=reason).with_event(WorkerRetired(environment_id=self.environment_id, time=time, worker_id=self.id, name=self.name, dispatcher=self.dispatcher))

    def is_running(self) -> bool:
        return self.state == WorkerState.DISPATCHED

    def is_idle(self) -> bool:
        return self.state == WorkerState.REPORTED and not self.adopted

    def overlaps(self, paths: set[str]) -> bool:
        return any(file.endswith(path) or path.endswith(file) for file in self.touched_paths or () for path in paths)

    def files_line(self) -> str:
        if self.touched_paths is None:
            return "no files known"
        return ", ".join(self.touched_paths) or "no files changed"

    def title_words(self) -> str:
        return self.name

    def summary_line(self) -> str:
        return self.first_line(self.brief)
