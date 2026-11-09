from collections.abc import Sequence
from typing import ClassVar, Protocol

from core.base.driver.span_queries import SpanQueries
from core.base.timestamp import Timestamp


class Span(Protocol):
    """One thing an interval waits for, counted from the moment the interval last fired, in its unit."""

    unit: ClassVar[str]
    count: int

    def has_passed(self, reads: SpanQueries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool: ...

    def has_passed_many(self, reads: SpanQueries, agent_id: int, starts: Sequence[Timestamp], checked_at: Timestamp) -> list[bool]:
        return [self.has_passed(reads, agent_id, start, checked_at) for start in starts]
