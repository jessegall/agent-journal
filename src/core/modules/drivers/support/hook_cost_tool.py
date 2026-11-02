import time

from core.base.database.database import Database
from core.base.database.points import Points
from core.base.driver.hook_event import HookEvent
from core.base.journal_home import JournalHome
from core.base.performance.performance_tool import PerformanceTool
from core.base.timing import Timing
from core.modules.developer.support.hook_numbers_file import HookNumbersFile

HOOK_LIMIT_POINTS = 50
STATEMENTS_LOGGED = 5


class HookCostTool(PerformanceTool):
    """How long a hook took and the points it cost the database, kept in the hook numbers; a hook that cost 50 points
    or more says so and is written to runtime/costly-hooks.log."""

    name = "drivers.hook-cost"

    def __init__(self, timing: Timing, database: Database, home: JournalHome, numbers: HookNumbersFile) -> None:
        self.timing, self.database, self.home, self.numbers = timing, database, home, numbers

    def measure(self, *values: object) -> object:
        event, start_points = values
        if not isinstance(event, HookEvent) or not isinstance(start_points, Points):
            raise TypeError("a hook's cost is measured from its event and the points it began with")
        milliseconds = (time.time_ns() // 1000 - self.timing.stamps[0][1]) // 1000
        points = self.database.tally.points().minus(start_points)
        self.numbers.add(event.event.value, milliseconds, points.total)
        if points.total < HOOK_LIMIT_POINTS:
            return f"hook {event.event.value} {milliseconds} ms, {points.total} points ({points.line()})"
        line = f"hook {event.event.value} {milliseconds} ms, {points.total} points ({points.line()}), over the {HOOK_LIMIT_POINTS} a hook may cost"
        self.home.costly_hooks_log.parent.mkdir(parents=True, exist_ok=True)
        with self.home.costly_hooks_log.open("a") as log:
            log.write(f"{time.strftime('%H:%M:%S')} {line}\n")
            log.writelines(f"    {rows} rows: {sql}\n" for sql, rows in points.statements.most_common(STATEMENTS_LOGGED))
            log.writelines(f"    {count} writes: {sql}\n" for sql, count in points.update_statements.most_common(STATEMENTS_LOGGED))
        return line
