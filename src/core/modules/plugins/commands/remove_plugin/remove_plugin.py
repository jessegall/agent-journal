from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RemovePlugin(Command[str]):
    """The person removes a plugin; its data folder stays unless purged."""

    name: str
    purge: bool
