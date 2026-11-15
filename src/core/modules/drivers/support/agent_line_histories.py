from collections.abc import Mapping

from engine.query.queries import Queries
from engine.request.request_values import RequestValues
from core.modules.drivers.models.agent_line_history import AgentLineHistory

LINE_HISTORIES_REASON = "an agent has one row for each line source that told it a line, a few dozen at most"


class AgentLineHistories:
    """The line history rows of an agent by source key, read once a request: the step reads when a source last
    spoke from them and the hook's record saves its lines against them."""

    def __init__(self, queries: Queries, request_values: RequestValues) -> None:
        self.queries, self.request_values = queries, request_values

    def rows(self, agent_id: int) -> Mapping[str, AgentLineHistory]:
        return self.request_values.read(f"drivers.line-histories:{agent_id}", lambda: 0, lambda: {
            row.source_key: row for row in self.queries.query(AgentLineHistory).filter(session_agent_id=agent_id).every_row(LINE_HISTORIES_REASON)})
