from engine.database.points import Points
from engine.performance.route_cost_tool import RouteCostTool
from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING
from core.modules.developer.support.hook_numbers_file import HookNumbersFile
from core.modules.settings.bindings.support.setting_values import SettingValues


class DeveloperRouteCostTool(RouteCostTool):
    """Stores route counts and points while development cost statistics are enabled."""

    def __init__(self, numbers: HookNumbersFile, settings: SettingValues) -> None:
        self.numbers, self.settings = numbers, settings

    def measure(self, *values: object) -> object:
        route, points = values
        if not isinstance(route, str) or not isinstance(points, Points):
            raise TypeError("a route's cost needs its path and measured points")
        if self.settings.project.value(HOOK_DURATIONS_SETTING) is True:
            self.numbers.add(f"route {route}", points.total)
        return None
