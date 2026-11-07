from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class ResetHookNumbers(Command[None]):
    """Starts the developer's counts of what hooks cost again."""

    lock = False
