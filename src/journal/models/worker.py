from dataclasses import dataclass

from journal.models.scoped import Scoped
from journal.models.worker_state import WorkerState


@dataclass(frozen=True)
class Worker(Scoped):
    """An agent sent to write one bounded job, in a worktree of its own when it changes code. A subagent only reads; a worker writes."""

    name: str = ""
    brief: str = ""
    provider: str = "claude"
    model: str = ""
    worktree: bool = False
    state: WorkerState = WorkerState.DISPATCHED
    session: str = ""
    dispatched_by: str = ""
    """The session of the agent that sent it, which is told when it reports."""
    resume: str = ""
    """The provider's own session of its last run, so its next job is given to the same worker with its memory."""

    def reported(self) -> "Worker":
        return self.with_(state=WorkerState.REPORTED)

    def told(self, brief: str) -> "Worker":
        """The same worker sent out again on its next job."""
        return self.with_(brief=brief, state=WorkerState.DISPATCHED)

    def stopped(self) -> "Worker":
        return self.with_(state=WorkerState.STOPPED)
