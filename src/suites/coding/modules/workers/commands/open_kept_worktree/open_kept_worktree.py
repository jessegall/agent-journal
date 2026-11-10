from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.models.worktree import Worktree


@dataclass(frozen=True)
class OpenKeptWorktree(Command[Worktree]):
    """Saves a new worktree row, still new, for a kept worker whose last worktree is merged."""

    worker_id: int
    task_id: int
