from engine.query.conditions.equal import Equal
from engine.query.conditions.excluding import Excluding
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.docking.guards.support.docking_arrival import DockingArrival
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.docking.support.dock_limits import MOST_ITEMS_SETTING, DockLimits
from core.base.change.changed import Changed
from core.base.command.context import Context
from core.modules.docking.models.dock_item import DockItem


class DockCapacityGuard(Guard[Changed[DockItem]]):
    """A dock holds no more items than the setting docking.most-items, 6 unless it says otherwise."""

    name = "docking.dock-limit"

    def __init__(self, items: DockItemQuery, limits: DockLimits) -> None:
        self.items, self.limits = items, limits

    def check(self, event: Changed[DockItem], context: Context) -> None:
        item = DockingArrival.item(event)
        if item is None or self.limits.requires_user(item.type):
            return
        capacity = self.limits.dock_capacity(item.dock_id)
        if self.items.docked(item.dock_id).same_chat(item.session_agent_id).matching(Excluding(Equal("id", item.id))).count() >= capacity:
            raise Refusal(f"the dock allows at most {capacity} items", f"undock one, or raise the setting {MOST_ITEMS_SETTING}")
