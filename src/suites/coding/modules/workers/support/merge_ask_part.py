from dataclasses import dataclass

from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.work_unit import WorkUnit


@dataclass(frozen=True)
class MergeAskPart:
    """What a worker's ask covers: its worktree and unit, the commit the ask ends at and the tasks it carries,
    the whole unit or the part up to one task or commit."""

    worktree: Worktree
    unit: WorkUnit
    commit_id: str
    task_ids: tuple[int, ...]
    is_full: bool
