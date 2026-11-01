from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.updates.models.release import Release


@dataclass(frozen=True)
class InstallRelease(Command[Release]):
    """Puts the newest release into the journal's code and records it."""
