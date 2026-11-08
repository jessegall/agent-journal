from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.models.worktree import Worktree


@dataclass(frozen=True)
class RecordWorktreeLibraries(Command[Worktree]):
    """Notes that a worktree's copied library folders were removed, or that they are back."""

    worktree_id: int
    dropped: bool
