from collections.abc import Mapping, Sequence

from engine.database.kept_rows import KeptRows
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.drivers.models.agent_line_history import AgentLineHistory

LINE_HISTORIES_REASON = "the rows of the source keys one step asks or gives, a few at most"


class AgentLineHistories:
    """The line history rows of an agent for the source keys asked, kept until they change: a line source reads when
    it last spoke from its own row, and the hook's record and the queued lines of a step save against the rows of
    the keys they give."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def rows(self, agent_id: int, source_keys: Sequence[str]) -> Mapping[str, AgentLineHistory]:
        histories = self.queries.query(AgentLineHistory).filter(session_agent_id=agent_id).matching(Among("source_key", list(source_keys)))
        return self.kept.read(histories, lambda: {row.source_key: row for row in histories.every_row(LINE_HISTORIES_REASON)}, name="drivers.line-histories")
