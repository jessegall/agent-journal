from dataclasses import dataclass

from suites.coding.modules.workers.models.worktree import Worktree


@dataclass(frozen=True)
class MergeOutcome:
    """What a merge did: the worktree, and the files in conflict when its task went back to the worker."""

    worktree: Worktree
    conflicts: tuple[str, ...]
