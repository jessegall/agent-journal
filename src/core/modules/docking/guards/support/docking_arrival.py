from engine.change.changed import Changed
from engine.change.deleted import Deleted
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState


class DockingArrival:
    """The item a change puts into the dock, if it does: a new item, or an undocked one docked again."""

    @staticmethod
    def item(event: Changed[DockItem]) -> DockItem | None:
        item, old = event.row, event.old_row
        if isinstance(event, Deleted) or item.state is not DockItemState.DOCKED:
            return None
        return item if old is None or old.state is DockItemState.UNDOCKED else None
