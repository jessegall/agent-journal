from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class PublishPluginReaders(Command[None]):
    """Makes the project's readers of a plugin that is switched on the readers its folder ships."""

    name: str
