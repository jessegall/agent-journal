from dataclasses import dataclass

from core.base.query.queries import Queries
from core.base.timestamp import MINUTE_SECONDS, Timestamp

@dataclass(frozen=True)
class Seconds:
    """A span of time."""

    unit = "seconds"

    count: int

    @classmethod
    def minutes(cls, count: int) -> "Seconds":
        return cls(count * MINUTE_SECONDS)

    @property
    def whole_minutes(self) -> int:
        return self.count // MINUTE_SECONDS

    def has_passed(self, queries: Queries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        return start.elapsed_seconds(timestamp) >= self.count
