from core.base.file_access import FileAccess
import time

from core.base.database.database import Database
from core.base.database.points import Points
from core.base.driver.hook_event import HookEvent
from core.base.journal_home import JournalHome
from core.base.performance.performance_tool import PerformanceTool
from core.modules.developer.support.hook_numbers_file import HookNumbersFile

HOOK_LIMIT_POINTS = 50
STATEMENTS_LOGGED = 5


class HookCostTool(PerformanceTool):
    """Database points spent by hooks, with expensive queries recorded in the cost log."""

    name = "drivers.hook-cost"

    def __init__(self, database: Database, home: JournalHome, numbers: HookNumbersFile) -> None:
        self.database, self.home, self.numbers = database, home, numbers

    def measure(self, *values: object) -> object:
        event, points = values
        if not isinstance(event, HookEvent) or not isinstance(points, Points):
            raise TypeError("a hook's cost needs its event and measured points")
        self.numbers.add(event.event.value, points.total)
        if points.total < HOOK_LIMIT_POINTS:
            return f"hook {event.event.value} {points.total} points ({points.line()})"
        line = f"hook {event.event.value} {points.total} points ({points.line()}), over the {HOOK_LIMIT_POINTS} a hook may cost"
        self.home.costly_hooks_log.parent.mkdir(parents=True, exist_ok=True)
        with FileAccess.shared().writer(self.home.costly_hooks_log, "a") as log:
            log.write(f"{time.strftime('%H:%M:%S')} {line}\n")
            log.writelines(f"    {rows} rows: {sql}\n" for sql, rows in points.statements.most_common(STATEMENTS_LOGGED))
            log.writelines(f"    {count} writes: {sql}\n" for sql, count in points.update_statements.most_common(STATEMENTS_LOGGED))
        return line
