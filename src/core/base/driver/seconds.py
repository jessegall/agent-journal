from dataclasses import dataclass

from core.base.query.queries import Queries
from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class Seconds:
    """A span of time."""

    count: int

    def has_passed(self, queries: Queries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        return start.elapsed_seconds(timestamp) >= self.count
