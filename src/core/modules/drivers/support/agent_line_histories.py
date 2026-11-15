from collections.abc import Mapping

from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from core.modules.drivers.models.agent_line_history import AgentLineHistory

LINE_HISTORIES_REASON = "an agent has one row for each line source that told it a line, a few dozen at most"


class AgentLineHistories:
    """The line history rows of an agent by source key, kept until they change: the step reads when a source last
    spoke from them, and the hook's record and the queued lines of a step save against them."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def rows(self, agent_id: int) -> Mapping[str, AgentLineHistory]:
        histories = self.queries.query(AgentLineHistory).filter(session_agent_id=agent_id)
        return self.kept.read(histories, lambda: {row.source_key: row for row in histories.every_row(LINE_HISTORIES_REASON)}, name="drivers.line-histories")
