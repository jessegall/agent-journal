from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RecordBehindLook(Command[None]):
    """Keeps when the worktrees of the environment in scope were last looked at for how far they are behind."""
