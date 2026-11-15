from collections.abc import Sequence

from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.request.request_values import RequestValues
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.wait import Wait

OPEN_WAITS_REASON = "the open waits of the agents one step reads, a few each"


class OpenWaits:
    """The open waits of some agents, read once a request: a step's wait need, its stop's need and its lines ask
    the same rows."""

    def __init__(self, queries: Queries, request_values: RequestValues) -> None:
        self.queries, self.request_values = queries, request_values

    def of(self, agent_ids: Sequence[int]) -> list[Wait]:
        key = ",".join(str(agent_id) for agent_id in sorted(set(agent_ids)))
        return self.request_values.read(f"waits.open:{key}", lambda: 0, lambda: list(
            self.queries.query(Wait).matching(Among("session_agent_id", sorted(set(agent_ids)))).filter(state=WaitState.OPEN).every_row(OPEN_WAITS_REASON)))
