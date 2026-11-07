from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.support.merge_outcome import MergeOutcome


@dataclass(frozen=True)
class RecordWorktreeMerge(Command[MergeOutcome]):
    """Saves what a merge's git work came to: the worktree is merged, or its clashing files go back to the worker."""

    worktree_id: int
    conflicts: tuple[str, ...]
    commit_before_merge: str = ""
    commit_after_merge: str = ""
