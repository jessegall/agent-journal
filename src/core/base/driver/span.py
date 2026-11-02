from typing import Protocol

from core.base.query.queries import Queries
from core.base.timestamp import Timestamp


class Span(Protocol):
    """One thing an interval waits for, counted from the moment the interval last fired."""

    def has_passed(self, queries: Queries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool: ...
