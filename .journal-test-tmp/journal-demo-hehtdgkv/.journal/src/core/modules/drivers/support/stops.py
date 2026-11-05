from collections.abc import Sequence
from dataclasses import dataclass

from core.base.driver.hook_event_name import HookEventName
from core.base.driver.span import Span
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.drivers.models.hook_call import HookCall


@dataclass(frozen=True)
class Stops(Span):
    """A span of stops received from the agent, whether allowed or refused."""

    unit = "stops"
    count: int

    def has_passed(self, queries: Queries, agent_id: int, start: Timestamp, timestamp: Timestamp) -> bool:
        return self.has_passed_many(queries, agent_id, [start], timestamp)[0]

    def has_passed_many(self, queries: Queries, agent_id: int, starts: Sequence[Timestamp], checked_at: Timestamp) -> list[bool]:
        stops = queries.query(HookCall).filter(agent_id=agent_id, hook=HookEventName.STOP).newest().page(1, self.count).rows
        return [len(stops) >= self.count and stops[-1].creation_timestamp() > start for start in starts]
