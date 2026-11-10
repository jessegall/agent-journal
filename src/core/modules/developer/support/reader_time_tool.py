from engine.performance.performance_tool import PerformanceTool
from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING
from core.modules.developer.support.hook_numbers_file import HookNumbersFile
from core.modules.settings.bindings.support.setting_values import SettingValues


class ReaderTimeTool(PerformanceTool):
    """Database points spent by an output reader, kept with the hook costs."""

    name = "developer.reader-time"

    def __init__(self, numbers: HookNumbersFile, settings: SettingValues) -> None:
        self.numbers, self.settings = numbers, settings

    def measure(self, *values: object) -> object:
        reader, points = values
        if not isinstance(reader, str) or not isinstance(points, int):
            raise TypeError("a reader's cost needs its name and points")
        if self.settings.value(HOOK_DURATIONS_SETTING) is True:
            self.numbers.add(f"reader {reader}", points)
        return None
