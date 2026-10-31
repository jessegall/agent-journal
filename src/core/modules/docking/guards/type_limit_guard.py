from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.docking.guards.docking_arrival import DockingArrival
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.docking.support.dock_limits import DockLimits


class TypeLimitGuard(Guard):
    """A dock holds no more items of a type than the type's most."""

    name = "docking.type-limit"
    event = "dock_item.*"

    def __init__(self, limits: DockLimits, items: DockItemQuery) -> None:
        self.limits, self.items = limits, items

    def check(self, change: Change[Model]) -> None:
        item = DockingArrival.item(change)
        most = self.limits.type_most(item.type) if item is not None else None
        if item is None or most is None:
            return
        held = [other for other in self.items.docked(item.dock_id).of_type(item.type).all_rows() if other.id != item.id]
        if len(held) >= most:
            raise Refusal(f"{item.type} holds at most {most} items", "undock one, or keep fewer items of this type")
