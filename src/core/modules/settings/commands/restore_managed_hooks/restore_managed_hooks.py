from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RestoreManagedHooks(Command[int]):
    """Returns every managed project hook to its native file."""
