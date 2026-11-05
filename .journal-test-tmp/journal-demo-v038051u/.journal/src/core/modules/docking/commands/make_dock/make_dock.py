from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.docking.models.dock import Dock


@dataclass(frozen=True)
class MakeDock(Command[Dock]):
    """Makes the dock above an environment's chat, or gives back the one it has."""

    environment_id: int
