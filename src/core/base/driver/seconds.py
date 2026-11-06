from dataclasses import dataclass

from core.base.driver.span import Span

from core.base.driver.span_queries import SpanQueries
from core.base.timestamp import MINUTE_SECONDS, Timestamp

@dataclass(frozen=True)
class Seconds(Span):
    """A span of time."""

    unit = "seconds"

    count: int

    @classmethod
    def minutes(cls, count: int) -> "Seconds":
        return cls(count * MINUTE_SECONDS)

    @property
    def minute_count(self) -> int:
        return self.count // MINUTE_SECONDS

    def has_passed(self, reads: SpanQueries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        return start.elapsed_seconds(timestamp) >= self.count
