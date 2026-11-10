from engine.query.conditions.equal import Equal
from engine.query.conditions.excluding import Excluding
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
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
        if item is None or capacity is None or self.limits.requires_user(item.type):
            return
        if self.items.docked(item.dock_id).same_chat(item.session_agent_id).type_items(item.type).matching(Excluding(Equal("id", item.id))).count() >= capacity:
            raise Refusal(f"{item.type} allows at most {capacity} items", "undock one, or keep fewer items of this type")
