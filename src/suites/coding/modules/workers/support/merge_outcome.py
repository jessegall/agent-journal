from dataclasses import dataclass

from suites.coding.modules.workers.models.worktree import Worktree


@dataclass(frozen=True)
class MergeOutcome:
    """What a merge did: the worktree, the files in conflict when its task went back to the worker, a
    plugin's refusal when a guard stopped the merge before git merged anything, and the tasks of the unit
    it left open since they have no proof of their own in the worktree."""

    worktree: Worktree
    conflicts: tuple[str, ...]
    refusal: str = ""
    open_task_ids: tuple[int, ...] = ()
