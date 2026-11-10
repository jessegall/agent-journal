from dataclasses import dataclass

from engine.command.command import Command
from core.modules.updates.models.enums.update_step import UpdateStep
from core.modules.updates.models.release_install import ReleaseInstall


@dataclass(frozen=True)
class RecordReleaseInstall(Command[ReleaseInstall]):
    """Records an installation step and its failure reason when it fails."""

    install_id: int
    step: UpdateStep
    detail: str = ""
