from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.docking.guards.docking_arrival import DockingArrival
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.docking.support.dock_limits import DockLimits


class TypeLimitGuard(Guard):
    """A dock holds no more items of a type than the type's capacity."""

    name = "docking.type-limit"
    event = "dock_item.*"

    def __init__(self, limits: DockLimits, items: DockItemQuery) -> None:
        self.limits, self.items = limits, items

    def check(self, change: Change[Model]) -> None:
        item = DockingArrival.item(change)
        capacity = self.limits.type_capacity(item.type) if item is not None else None
        if item is None or capacity is None:
            return
        docked_items = [sibling for sibling in self.items.docked(item.dock_id).type_items(item.type).all_rows() if sibling.id != item.id]
        if len(docked_items) >= capacity:
            raise Refusal(f"{item.type} allows at most {capacity} items", "undock one, or keep fewer items of this type")
