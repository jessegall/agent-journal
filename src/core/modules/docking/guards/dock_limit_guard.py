from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.docking.guards.docking_arrival import DockingArrival
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.docking.support.dock_limits import MOST_ITEMS_SETTING, DockLimits


class DockLimitGuard(Guard):
    """A dock holds no more items than the setting docking.most-items, 6 unless it says otherwise."""

    name = "docking.dock-limit"
    event = "dock_item.*"

    def __init__(self, items: DockItemQuery, limits: DockLimits) -> None:
        self.items, self.limits = items, limits

    def check(self, change: Change[Model]) -> None:
        item = DockingArrival.item(change)
        if item is None:
            return
        most = self.limits.dock_most(item.dock_id)
        if len([other for other in self.items.docked(item.dock_id).all_rows() if other.id != item.id]) >= most:
            raise Refusal(f"the dock allows at most {most} items", f"undock one, or raise the setting {MOST_ITEMS_SETTING}")
