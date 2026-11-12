from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class CheckWorktreeBehind(Command[bool]):
    """Counts how far one worktree is behind its base branch and opens a check when it is far enough behind."""

    worktree_id: int
