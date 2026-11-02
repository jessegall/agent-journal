from core.base.driver.span import Span
from core.base.driver.seconds import Seconds
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp


class Interval:
    """A mix of spans: the first to pass fires the interval, and firing starts every span again from 0."""

    def __init__(self, *spans: Span) -> None:
        self.spans = spans

    def has_passed(self, queries: Queries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        return any(span.has_passed(queries, agent_id, start, timestamp) for span in self.spans)

    @property
    def seconds(self) -> int:
        return next((span.count for span in self.spans if isinstance(span, Seconds)), 0)
