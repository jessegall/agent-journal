from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.support.release_outcome import ReleaseOutcome


@dataclass(frozen=True)
class ReleaseWorker(Command[ReleaseOutcome]):
    """Takes a worker off its task: the task goes back to open and its worktree is removed. Committed work is only
    left behind when the release says so."""

    lock = False

    worker_id: int
    reason: str
    abandons_commits: bool = False
