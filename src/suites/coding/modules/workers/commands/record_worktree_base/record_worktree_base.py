from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.models.worktree import Worktree


@dataclass(frozen=True)
class RecordWorktreeBase(Command[Worktree]):
    """Saves the commit of the base branch a worktree's work now stands on the tasks its newest git commit
    took and that commit's short id."""

    worktree_id: int
    base_commit: str
    task_ids: tuple[int, ...]
    short_id: str
