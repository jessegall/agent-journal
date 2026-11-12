from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.models.enums.behind_route import BehindRoute


@dataclass(frozen=True)
class CheckWorktreeBehind(Command[BehindRoute]):
    """Counts how far one worktree is behind its base branch and opens a check when it is far enough behind."""

    worktree_id: int
