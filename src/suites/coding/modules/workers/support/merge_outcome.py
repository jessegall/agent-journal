from dataclasses import dataclass

from suites.coding.modules.workers.models.worktree import Worktree


@dataclass(frozen=True)
class MergeOutcome:
    """What a merge did: the worktree, the files in conflict when its task went back to the worker, and a plugin's
    refusal when a guard stopped the merge before git merged anything."""

    worktree: Worktree
    conflicts: tuple[str, ...]
    refusal: str = ""
