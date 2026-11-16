from core.modules.processes.conditions.priority_wait_figures import PriorityWaitFigures

from engine.enums.execution_priority import ExecutionPriority
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from engine.time.timestamp import HOUR_SECONDS, Timestamp
from core.modules.processes.models.process import Process


from core.modules.processes.support.priority_wait import PriorityWait
class PriorityWaits:
    """The waits of the runs of the short and long lanes that started in the last hour, for each priority they
    entered at, so a person sees whether the settings starve anything."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    # one grouped read, so the figures cost the same however many runs started in the hour
    def last_hour(self, current_time: Timestamp) -> list[PriorityWait]:
        started = self.queries.query(Process).matching(Greater("started_at", current_time.plus_seconds(-HOUR_SECONDS).text))
        figures = {ExecutionPriority(row["first_priority"]): row for row in self.queries.database.rows(PriorityWaitFigures(started.scoped(started.select)).statement())}
        return [PriorityWait(priority, int(figures[priority]["runs"]), float(figures[priority]["longest"]), float(figures[priority]["average"])) if priority in figures
                else PriorityWait(priority, 0, 0.0, 0.0) for priority in ExecutionPriority]
