from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class ClearWorkSource(Command[None]):
    """Clears the caller agent's current request."""
