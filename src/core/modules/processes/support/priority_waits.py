from core.modules.processes.conditions.priority_wait_figures import PriorityWaitFigures
from dataclasses import dataclass

from engine.enums.execution_priority import ExecutionPriority
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.processes.models.process import Process

HOUR_SECONDS = 3600


@dataclass(frozen=True)
class PriorityWait:
    """How the runs of one priority waited over the last hour: how many started, the longest and the average wait."""

    priority: ExecutionPriority
    count: int
    longest_seconds: float
    average_seconds: float

    @property
    def described(self) -> str:
        return f"{self.priority.label}: {self.count} runs started, longest wait {self.longest_seconds:.0f} s, average {self.average_seconds:.0f} s"


class PriorityWaits:
    """The waits of the runs of the short and long lanes that started in the last hour, for each priority they
    entered at, so a person sees whether the settings starve anything."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    # one grouped read, so the figures cost the same however many runs started in the hour
    def last_hour(self, now: Timestamp) -> list[PriorityWait]:
        started = self.queries.query(Process).matching(Greater("started_at", now.plus_seconds(-HOUR_SECONDS).text))
        figures = {ExecutionPriority(row["first_priority"]): row for row in self.queries.database.rows(PriorityWaitFigures(started.scoped(started.select)).statement())}
        return [PriorityWait(priority, int(figures[priority]["runs"]), float(figures[priority]["longest"]), float(figures[priority]["average"])) if priority in figures
                else PriorityWait(priority, 0, 0.0, 0.0) for priority in ExecutionPriority]
