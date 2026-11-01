import time

from core.base.driver.hook_event import HookEvent
from core.base.timing import Timing
from core.modules.drivers.support.driver_settings import HOOK_DURATIONS_SETTING
from core.modules.settings.bindings.support.setting_values import SettingValues


class HookDurations:
    """The line that shows in the terminal how long a hook took, from the first stamp of its request to now,
    while the developer switch, the hooks group inside it and the durations setting are all on."""

    def __init__(self, timing: Timing, settings: SettingValues) -> None:
        self.timing, self.settings = timing, settings

    def line(self, event: HookEvent, environment_id: int) -> str:
        if not self.timing.stamps or self.settings.value(HOOK_DURATIONS_SETTING, environment_id) is not True:
            return ""
        milliseconds = (time.time_ns() // 1000 - self.timing.stamps[0][1]) // 1000
        return f"hook {event.event.value} {milliseconds} ms"
