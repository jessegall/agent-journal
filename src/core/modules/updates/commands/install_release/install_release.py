from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.updates.models.release_install import ReleaseInstall


@dataclass(frozen=True)
class InstallRelease(Command[ReleaseInstall]):
    """Starts installation of the newest release and records its attempt."""
