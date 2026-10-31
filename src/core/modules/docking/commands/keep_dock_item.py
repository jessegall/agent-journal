from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.docking.models.dock_item import DockItem


@dataclass(frozen=True)
class KeepDockItem(Command[DockItem]):
    """Keeps a docked item that would leave by itself once its row ends."""

    item_id: int
