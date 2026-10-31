from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class PrepareWorktree(Command[None]):
    """Gives a launch worktree the library folders of the project's folder and runs the worktree commands in it."""

    folder: str
    source: str
