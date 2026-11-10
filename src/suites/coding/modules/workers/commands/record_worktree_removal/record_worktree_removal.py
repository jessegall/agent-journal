from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.models.worktree import Worktree


@dataclass(frozen=True)
class RecordWorktreeRemoval(Command[Worktree]):
    """Saves that a merged or abandoned worktree's folder is gone."""

    worktree_id: int
