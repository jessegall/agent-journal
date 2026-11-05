from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.viewer.models.person_preset import PersonPreset


@dataclass(frozen=True)
class RenamePersonPreset(Command[PersonPreset]):
    """Gives one of the caller's presets of your own another name."""

    row_id: int
    name: str
