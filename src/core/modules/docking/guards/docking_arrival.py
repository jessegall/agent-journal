from core.base.change.change import Change
from core.base.model.model import Model
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.models.enums.dock_item_state import DockItemState


class DockingArrival:
    """The item a change puts into the dock, if it does: a new item, or an undocked one docked again."""

    @staticmethod
    def item(change: Change[Model]) -> DockItem | None:
        item, old = change.new_row, change.old_row
        if not isinstance(item, DockItem) or item.state is not DockItemState.DOCKED:
            return None
        return item if old is None or (isinstance(old, DockItem) and old.state is DockItemState.UNDOCKED) else None
