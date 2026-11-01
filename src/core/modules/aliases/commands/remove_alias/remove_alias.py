from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RemoveAlias(Command[str]):
    """Removes an alias by its name."""

    name: str
