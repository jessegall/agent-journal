from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RemoveExecutionClass(Command[str]):
    """Removes a class the person added, or with is_reset brings a changed built-in class back to its default."""

    name: str
    is_reset: bool
