from dataclasses import dataclass
from datetime import timedelta

from engine.driver.span import Span

from engine.driver.span_queries import SpanQueries
from engine.time.timestamp import MINUTE_SECONDS, Timestamp

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

    def has_elapsed(self, start: Timestamp, timestamp: Timestamp) -> bool:
        return start.elapsed_seconds(timestamp) >= self.count

    def deducted(self, timestamp: Timestamp) -> Timestamp:
        return Timestamp(timestamp.value - timedelta(seconds=self.count))

    def has_passed(self, reads: SpanQueries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        return self.has_elapsed(start, timestamp)
