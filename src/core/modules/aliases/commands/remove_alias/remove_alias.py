from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RemoveAlias(Command[str]):
    """Removes an alias by its name."""

    name: str
