from core.base.query.queries import Queries
from core.base.registry.registry import Registry
from core.modules.docking.models.dock import Dock
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.docking"
MOST_ITEMS_SETTING = f"{MODULE_KEY}.most-items"
DOCKING_SETTINGS = [SettingValue("most-items", "Docked items", "How many items the dock holds at once.", SettingType.NUMBER, default=6)]


class DockLimits:
    """How many items a dock holds in all, from the docking module's most-items setting, and how many of one type,
    from the type's declaration."""

    def __init__(self, registry: Registry, queries: Queries, settings: SettingValues) -> None:
        self.registry, self.queries, self.settings = registry, queries, settings

    def dock_capacity(self, dock_id: int) -> int:
        return self.settings.number(MOST_ITEMS_SETTING, self.queries.query(Dock).find(dock_id).environment_id)

    def type_capacity(self, type: str) -> int | None:
        declared = next((entry for entry in self.registry.docks if entry.type == type), None)
        return declared.most if declared is not None else None
