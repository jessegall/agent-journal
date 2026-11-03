from dataclasses import dataclass

from core.base.query.queries import Queries
from core.base.timestamp import SECONDS_PER_MINUTE, Timestamp

@dataclass(frozen=True)
class Seconds:
    """A span of time."""

    count: int

    @classmethod
    def minutes(cls, count: int) -> "Seconds":
        return cls(count * SECONDS_PER_MINUTE)

    @property
    def whole_minutes(self) -> int:
        return self.count // SECONDS_PER_MINUTE

    def has_passed(self, queries: Queries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        return start.elapsed_seconds(timestamp) >= self.count
