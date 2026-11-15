from engine.database.database import Database
from engine.query.queries import Queries
from engine.request.request_values import RequestValues
from core.modules.drivers.models.agent_block import AgentBlock, OPEN_BLOCKS_REASON


class OpenBlockRows:
    """An agent's open block rows, read once a request until a write changes them: the view of its step and the lines
    that close a stale block share one read."""

    def __init__(self, queries: Queries, request_values: RequestValues, database: Database) -> None:
        self.queries, self.request_values, self.database = queries, request_values, database

    def rows(self, agent_id: int) -> tuple[AgentBlock, ...]:
        return self.request_values.read(f"drivers.open-blocks:{agent_id}", self.database.change_mark,
                                        lambda: tuple(self.queries.query(AgentBlock).filter(session_agent_id=agent_id, closed_at=None).every_row(OPEN_BLOCKS_REASON)))
