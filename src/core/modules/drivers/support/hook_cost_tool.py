from core.base.database.database import Database
from core.base.database.points import Points
from core.base.driver.hook_event import HookEvent
from core.base.log_level import LogLevel
from core.base.performance.performance_tool import PerformanceTool
from core.base.system_log_writer import SystemLogWriter
from core.modules.developer.support.hook_numbers_file import HookNumbersFile

HOOK_LIMIT_POINTS = 50
STATEMENTS_LOGGED = 5


class HookCostTool(PerformanceTool):
    """Database points spent by hooks, with expensive queries written to the system log."""

    name = "drivers.hook-cost"

    def __init__(self, database: Database, system_log: SystemLogWriter, numbers: HookNumbersFile) -> None:
        self.database, self.system_log, self.numbers = database, system_log, numbers

    def measure(self, *values: object) -> object:
        event, points = values
        if not isinstance(event, HookEvent) or not isinstance(points, Points):
            raise TypeError("a hook's cost needs its event and measured points")
        self.numbers.add(event.event.value, points.total)
        if points.total < HOOK_LIMIT_POINTS:
            return f"hook {event.event.value} {points.total} points ({points.line()})"
        line = f"hook {event.event.value} {points.total} points ({points.line()}), over the {HOOK_LIMIT_POINTS} a hook may cost"
        statement_lines = [f"    {rows} rows: {sql}" for sql, rows in points.statements.most_common(STATEMENTS_LOGGED)]
        update_lines = [f"    {count} writes: {sql}" for sql, count in points.update_statements.most_common(STATEMENTS_LOGGED)]
        self.system_log.write(LogLevel.WARNING, "\n".join((line, *statement_lines, *update_lines)))
        return line
