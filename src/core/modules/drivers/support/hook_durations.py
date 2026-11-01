import time

from core.base.database.database import Database
from core.base.database.point_tally import Points
from core.base.driver.hook_event import HookEvent
from core.base.journal_home import JournalHome
from core.base.timing import Timing
from core.modules.drivers.support.driver_settings import HOOK_DURATIONS_SETTING
from core.modules.settings.bindings.support.setting_values import SettingValues

HOOK_POINT_LIMIT = 50
STATEMENTS_LOGGED = 5


class HookDurations:
    """The line that shows in the terminal how long a hook took, from the first stamp of its request to now, and the
    points it cost the database, while the developer switch, the hooks group inside it and the durations setting are
    all on; a hook that cost 50 points or more says so and is written to runtime/costly-hooks.log."""

    def __init__(self, timing: Timing, settings: SettingValues, database: Database, home: JournalHome) -> None:
        self.timing, self.settings, self.database, self.home = timing, settings, database, home
        self.begun = Points()

    def begin(self) -> None:
        self.begun = self.database.tally.points()

    def line(self, event: HookEvent, environment_id: int) -> str:
        if not self.timing.stamps or self.settings.value(HOOK_DURATIONS_SETTING, environment_id) is not True:
            return ""
        milliseconds = (time.time_ns() // 1000 - self.timing.stamps[0][1]) // 1000
        points = self.database.tally.points().since(self.begun)
        over = f", over the {HOOK_POINT_LIMIT} a hook may cost" if points.total >= HOOK_POINT_LIMIT else ""
        line = f"hook {event.event.value} {milliseconds} ms, {points.total} points ({points.line()}){over}"
        if over:
            self.home.costly_hooks_log.parent.mkdir(parents=True, exist_ok=True)
            with self.home.costly_hooks_log.open("a") as log:
                log.write(f"{time.strftime('%H:%M:%S')} {line}\n")
                log.writelines(f"    {rows} rows: {sql}\n" for sql, rows in points.statements.most_common(STATEMENTS_LOGGED))
                log.writelines(f"    {count} writes: {sql}\n" for sql, count in points.written.most_common(STATEMENTS_LOGGED))
        return line
