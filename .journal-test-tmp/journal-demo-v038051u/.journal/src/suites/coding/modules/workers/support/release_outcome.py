from dataclasses import dataclass

from suites.coding.modules.workers.models.worktree import Worktree


@dataclass(frozen=True)
class ReleaseOutcome:
    """What a release did: the removed worktree, and its branch when commits on it are not merged."""

    worktree: Worktree
    unmerged_branch: str
