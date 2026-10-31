from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.base.query.queries import Queries
from core.modules.docking.guards.docking_arrival import DockingArrival
from core.modules.docking.models.dock import Dock
from core.modules.docking.queries.dock_item_query import DockItemQuery
from core.modules.settings.bindings.support.setting_values import SettingValues

MOST_ITEMS_SETTING = "docking.most-items"
DEFAULT_MOST_ITEMS = 6


class DockLimitGuard(Guard):
    """A dock holds no more items than the setting docking.most-items, 6 unless it says otherwise."""

    name = "docking.dock-limit"
    event = "dock_item.*"

    def __init__(self, items: DockItemQuery, queries: Queries, settings: SettingValues) -> None:
        self.items, self.queries, self.settings = items, queries, settings

    def check(self, change: Change[Model]) -> None:
        item = DockingArrival.item(change)
        if item is None:
            return
        most = self.settings.value(MOST_ITEMS_SETTING, self.queries.query(Dock).find(item.dock_id).environment_id, DEFAULT_MOST_ITEMS)
        limit = most if isinstance(most, int) else DEFAULT_MOST_ITEMS
        if len([other for other in self.items.docked(item.dock_id).all_rows() if other.id != item.id]) >= limit:
            raise Refusal(f"the dock holds at most {limit} items", f"undock one, or raise the setting {MOST_ITEMS_SETTING}")
