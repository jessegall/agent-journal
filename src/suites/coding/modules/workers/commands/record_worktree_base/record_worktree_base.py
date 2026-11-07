from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.models.worktree import Worktree


@dataclass(frozen=True)
class RecordWorktreeBase(Command[Worktree]):
    """Saves the commit of the base branch a worktree's work now stands on."""

    worktree_id: int
    base_commit: str
