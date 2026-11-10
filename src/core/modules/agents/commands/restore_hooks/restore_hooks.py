from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RestoreHooks(Command[int]):
    """Restores every managed project hook to its source file."""

    lock = False
