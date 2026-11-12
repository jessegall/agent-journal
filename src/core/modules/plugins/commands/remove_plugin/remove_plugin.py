from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RemovePlugin(Command[str]):
    """The user removes a plugin; its data folder stays unless purged."""

    name: str
    purge: bool
