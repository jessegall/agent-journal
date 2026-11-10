from dataclasses import dataclass

from engine.command.command import Command
from core.modules.docking.models.dock_item import DockItem


@dataclass(frozen=True)
class ReleaseDockItem(Command[DockItem]):
    """Lets a kept docked item leave by itself again once its row ends."""

    item_id: int
