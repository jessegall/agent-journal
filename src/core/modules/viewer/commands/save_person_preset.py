from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.viewer.models.person_preset import PersonPreset


@dataclass(frozen=True)
class SavePersonPreset(Command[PersonPreset]):
    """Keeps a layout of one page as a preset for the calling person in the caller's environment."""

    page: str
    name: str
    shape: str
