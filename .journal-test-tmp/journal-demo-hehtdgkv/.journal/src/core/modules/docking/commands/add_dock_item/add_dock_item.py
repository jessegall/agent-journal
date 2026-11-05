from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.docking.models.dock_item import DockItem


@dataclass(frozen=True)
class AddDockItem(Command[DockItem]):
    """Docks an item of a declared type above an environment's chat, within the type's limits and the
    dock's; with no environment named, the environment the command runs in."""

    environment_id: int | None
    type: str
    row_model: str
    row_id: int
