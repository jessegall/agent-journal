from dataclasses import dataclass

from core.base.command.command import Command
from core.base.timestamp import Timestamp
from core.modules.docking.models.dock_item import DockItem


@dataclass(frozen=True)
class ScheduleDockItemLeave(Command[DockItem]):
    """Sets when an item leaves the dock by itself."""

    item_id: int
    leaves_at: Timestamp
