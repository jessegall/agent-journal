import time

from core.base.database.database import Database
from core.base.database.point_tally import Points
from core.base.driver.hook_event import HookEvent
from core.base.timing import Timing
from core.modules.drivers.support.driver_settings import HOOK_DURATIONS_SETTING
from core.modules.settings.bindings.support.setting_values import SettingValues

HOOK_POINT_LIMIT = 25


class HookDurations:
    """The line that shows in the terminal how long a hook took, from the first stamp of its request to now, and the
    points it cost the database, while the developer switch, the hooks group inside it and the durations setting are
    all on; a hook that cost 25 points or more says so."""

    def __init__(self, timing: Timing, settings: SettingValues, database: Database) -> None:
        self.timing, self.settings, self.database = timing, settings, database
        self.begun = Points()

    def begin(self) -> None:
        self.begun = self.database.tally.points()

    def line(self, event: HookEvent, environment_id: int) -> str:
        if not self.timing.stamps or self.settings.value(HOOK_DURATIONS_SETTING, environment_id) is not True:
            return ""
        milliseconds = (time.time_ns() // 1000 - self.timing.stamps[0][1]) // 1000
        points = self.database.tally.points().since(self.begun)
        over = f", over the {HOOK_POINT_LIMIT} a hook may cost" if points.total >= HOOK_POINT_LIMIT else ""
        return f"hook {event.event.value} {milliseconds} ms, {points.total} points ({points.line()}){over}"
