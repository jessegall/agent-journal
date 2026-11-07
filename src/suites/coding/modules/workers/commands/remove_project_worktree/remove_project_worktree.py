from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RemoveProjectWorktree(Command[str]):
    """Removes a worktree folder nobody is working in, keeping its branch."""

    lock = False

    folder: str
