from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.viewer.models.person_preset import PersonPreset


@dataclass(frozen=True)
class RemovePersonPreset(Command[PersonPreset]):
    """Deletes one of the caller's presets of your own."""

    row_id: int
