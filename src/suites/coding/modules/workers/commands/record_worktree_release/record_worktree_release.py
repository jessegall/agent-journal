from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.models.worktree import Worktree


@dataclass(frozen=True)
class RecordWorktreeRelease(Command[Worktree]):
    """Saves that a worker is taken off its work: its worktree is abandoned and its tasks are released."""

    worktree_id: int
    reason: str
