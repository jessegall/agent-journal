from collections.abc import Sequence

from engine.driver.span import Span
from engine.driver.seconds import Seconds
from engine.driver.span_queries import SpanQueries
from engine.time.timestamp import Timestamp


class Interval:
    """A mix of spans: the first to pass fires the interval, and firing starts every span again from 0."""

    def __init__(self, *spans: Span) -> None:
        self.spans = spans

    def has_passed(self, reads: SpanQueries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        return any(span.has_passed(reads, agent_id, start, timestamp) for span in self.spans)

    def has_passed_many(self, reads: SpanQueries, agent_id: int, starts: Sequence[Timestamp], checked_at: Timestamp) -> list[bool]:
        passed = [False] * len(starts)
        for span in self.spans:
            pending = [index for index, passed_span in enumerate(passed) if not passed_span]
            if not pending:
                break
            answers = span.has_passed_many(reads, agent_id, [starts[index] for index in pending], checked_at)
            for index, answer in zip(pending, answers):
                passed[index] = answer
        return passed

    @property
    def seconds(self) -> int:
        return next((span.count for span in self.spans if isinstance(span, Seconds)), 0)
