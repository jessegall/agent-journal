from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.task_source_copy import TaskSourceCopy


@dataclass(frozen=True)
class RecordWorktreeCut(Command[Worktree]):
    """Saves that git cut a worktree and it is prepared, delegates the dispatched tasks to its worker and starts
    the first."""

    worktree_id: int
    base_commit: str
    task_ids: tuple[int, ...]
    task_sources: tuple[TaskSourceCopy, ...] = ()
    library_links: str = "[]"
