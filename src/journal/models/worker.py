from typing import ClassVar
from dataclasses import dataclass

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
    """The session of the agent that sent it, which is told when it reports."""
    resume: str = ""
    """The provider's own session of its last run, so its next job is given to the same worker with its memory."""
    taken_up: bool = False
    """Whether the agent has acted on its last report: given it its next job, stopped it, or marked it done."""
    pid: int = 0
    began: float = 0.0
    found_session: str = ""

    def reported(self) -> "Worker":
        return self.with_(state=WorkerState.REPORTED, taken_up=False, pid=0)

    def running_as(self, pid: int, began: float) -> "Worker":
        return self.with_(pid=pid, began=began, found_session="")

    def told(self, brief: str) -> "Worker":
        """The same worker sent out again on its next job."""
        return self.with_(brief=brief, state=WorkerState.DISPATCHED)

    def stopped(self) -> "Worker":
        return self.with_(state=WorkerState.STOPPED, taken_up=True)

    def done(self) -> "Worker":
        """Its report acted on: merged, used or set aside."""
        return self.with_(taken_up=True)

    def is_out(self) -> bool:
        return self.state == WorkerState.DISPATCHED

    def has_report_waiting(self) -> bool:
        """Reported, and its report not yet acted on."""
        return self.state == WorkerState.REPORTED and not self.taken_up
