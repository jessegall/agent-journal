from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.support.release_outcome import ReleaseOutcome


@dataclass(frozen=True)
class ReleaseWorker(Command[ReleaseOutcome]):
    """Takes a worker off its task: the task goes back to open and its worktree is removed."""

    worker_id: int
    reason: str
