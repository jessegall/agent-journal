from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.support.commit_outcome import CommitOutcome


@dataclass(frozen=True)
class CommitWorkerWork(Command[CommitOutcome]):
    """A worker commits its work: its worktree is committed and its tasks wait for their proofs to be
    checked."""

    differences: str
