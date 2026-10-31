from datetime import timedelta

from core.base.registry.registry import Registry
from core.base.timestamp import Timestamp
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.support.row_end import RowEnd


class LeaveTime:
    """When an item leaves the dock by itself: its type's leaves_after_seconds after its row ended, never
    for a kept item or a type that lets its items stay."""

    def __init__(self, registry: Registry, row_end: RowEnd) -> None:
        self.registry, self.row_end = registry, row_end

    def at(self, item: DockItem, now: Timestamp) -> Timestamp | None:
        declared = next((entry for entry in self.registry.docks if entry.type == item.type), None)
        if item.kept or declared is None or declared.leaves_after_seconds <= 0 or not self.row_end.ended(item):
            return None
        return Timestamp(now.value + timedelta(seconds=declared.leaves_after_seconds))
