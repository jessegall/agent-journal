from collections.abc import Sequence
from dataclasses import dataclass

from engine.enums.hook_event_name import HookEventName
from engine.driver.span import Span
from engine.driver.span_queries import SpanQueries
from engine.time.timestamp import Timestamp
from core.modules.drivers.queries.hook_call_query import HookCallQuery


@dataclass(frozen=True)
class Stops(Span):
    """A span of stops received from the agent, whether allowed or refused."""

    unit = "stops"
    count: int

    def has_passed(self, reads: SpanQueries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        return self.has_passed_many(reads, agent_id, [start], timestamp)[0]

    def has_passed_many(self, reads: SpanQueries, agent_id: int, starts: Sequence[Timestamp], checked_at: Timestamp) -> list[bool]:
        stops = HookCallQuery(reads.queries.database, reads.queries.tables, reads.kept).agent(agent_id).filter(hook=HookEventName.STOP).newest().limited(self.count)
        return [len(stops) >= self.count and stops[-1].creation_timestamp() > start for start in starts]
