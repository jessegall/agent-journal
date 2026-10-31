from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.docking.guards.docking_arrival import DockingArrival
from core.modules.docking.queries.dock_item_query import DockItemQuery


class TypeLimitGuard(Guard):
    """A dock holds no more items of a type than the type's most."""

    name = "docking.type-limit"
    event = "dock_item.*"

    def __init__(self, registry: Registry, items: DockItemQuery) -> None:
        self.registry, self.items = registry, items

    def check(self, change: Change[Model]) -> None:
        item = DockingArrival.item(change)
        declared = next((entry for entry in self.registry.docks if item is not None and entry.type == item.type), None)
        if item is None or declared is None:
            return
        held = [other for other in self.items.docked(item.dock_id).of_type(item.type).all_rows() if other.id != item.id]
        if len(held) >= declared.most:
            raise Refusal(f"{item.type} holds at most {declared.most} items", "undock one, or keep fewer items of this type")
