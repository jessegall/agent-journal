from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class UpdatePluginReaders(Command[None]):
    """Saves the readers every running plugin ships that the project has no reader of that name for."""
