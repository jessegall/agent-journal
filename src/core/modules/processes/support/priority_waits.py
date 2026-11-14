from collections.abc import Iterable
from dataclasses import dataclass

from engine.enums.execution_priority import ExecutionPriority
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from engine.time.timestamp import Timestamp
from core.modules.processes.models.process import Process

HOUR_SECONDS = 3600
STARTED_REASON = "the waits of the last hour are counted over every run that started in it"


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

    def last_hour(self, now: Timestamp) -> list[PriorityWait]:
        since = now.plus_seconds(-HOUR_SECONDS)
        return self.waits(self.queries.query(Process).matching(Greater("started_at", since.text)).every_row(STARTED_REASON))

    @staticmethod
    def waits(runs: Iterable[Process]) -> list[PriorityWait]:
        waited: dict[ExecutionPriority, list[float]] = {priority: [] for priority in ExecutionPriority}
        for run in runs:
            if run.started_at is not None:
                waited[run.first_priority].append(max(0.0, run.creation_timestamp().elapsed_seconds(run.started_at)))
        return [PriorityWait(priority, len(seconds), max(seconds, default=0.0), sum(seconds) / len(seconds) if seconds else 0.0) for priority, seconds in waited.items()]
