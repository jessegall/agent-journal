from core.base.performance.performance_tool import PerformanceTool
from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING
from core.modules.developer.support.hook_numbers_file import HookNumbersFile
from core.modules.settings.bindings.support.setting_values import SettingValues


class ReaderTimeTool(PerformanceTool):
    """How long an output reader took on the text it was handed, kept in the hook numbers under the reader's name
    while Hook durations is on for the run's environment."""

    name = "developer.reader-time"

    def __init__(self, numbers: HookNumbersFile, settings: SettingValues) -> None:
        self.numbers, self.settings = numbers, settings

    def measure(self, *values: object) -> object:
        reader, milliseconds, environment_id = values
        if not isinstance(reader, str) or not isinstance(milliseconds, int) or not isinstance(environment_id, int):
            raise TypeError("a reader's time is measured from its name, its milliseconds and the environment of its run")
        if self.settings.value(HOOK_DURATIONS_SETTING, environment_id) is True:
            self.numbers.add(f"reader {reader}", milliseconds, 0)
        return None
