from dataclasses import dataclass

from engine.command.command import Command
from core.modules.aliases.models.alias import Alias


@dataclass(frozen=True)
class SetAliasSilence(Command[Alias]):
    """Marks a saved command silent after a run of it printed nothing, or clears the mark after a run of its
    edited line printed."""

    name: str
    silent: bool
