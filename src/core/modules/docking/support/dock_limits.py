from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.modules.docking.models.dock import Dock
from core.modules.settings.bindings.support.setting_values import SettingValues

MOST_ITEMS_SETTING = "docking.most-items"
DEFAULT_MOST_ITEMS = 6


class DockLimits:
    """How many items a dock holds in all, from the setting docking.most-items, and how many of one type,
    from the type's declaration."""

    def __init__(self, registry: Registry, queries: Queries, settings: SettingValues) -> None:
        self.registry, self.queries, self.settings = registry, queries, settings

    def dock_most(self, dock_id: int) -> int:
        most = self.settings.value(MOST_ITEMS_SETTING, self.queries.query(Dock).find(dock_id).environment_id, DEFAULT_MOST_ITEMS)
        return most if isinstance(most, int) else DEFAULT_MOST_ITEMS

    def type_most(self, type: str) -> int | None:
        declared = next((entry for entry in self.registry.docks if entry.type == type), None)
        return declared.most if declared is not None else None
