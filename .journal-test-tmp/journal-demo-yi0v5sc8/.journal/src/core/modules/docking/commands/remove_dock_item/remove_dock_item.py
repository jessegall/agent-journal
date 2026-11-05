from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.docking.models.dock_item import DockItem


@dataclass(frozen=True)
class RemoveDockItem(Command[DockItem]):
    """Takes a docked item out of the dock; the row it points at stays as it is."""

    item_id: int
