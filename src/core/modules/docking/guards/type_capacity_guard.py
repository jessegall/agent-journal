from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.docking.guards.support.docking_arrival import DockingArrival
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.docking.support.dock_limits import DockLimits
from core.base.change.changed import Changed
from core.base.command.context import Context
from core.modules.docking.models.dock_item import DockItem


class TypeCapacityGuard(Guard[Changed[DockItem]]):
    """A dock holds no more items of a type than the type's capacity."""

    name = "docking.type-limit"

    def __init__(self, limits: DockLimits, items: DockItemQuery) -> None:
        self.limits, self.items = limits, items

    def check(self, event: Changed[DockItem], context: Context) -> None:
        item = DockingArrival.item(event)
        capacity = self.limits.type_capacity(item.type) if item is not None else None
        if item is None or capacity is None:
            return
        docked_items = [sibling for sibling in self.items.docked(item.dock_id).same_chat(item.session_agent_id).type_items(item.type).all_rows() if sibling.id != item.id]
        if len(docked_items) >= capacity:
            raise Refusal(f"{item.type} allows at most {capacity} items", "undock one, or keep fewer items of this type")
