from engine.database.database import Database
from engine.query.queries import Queries
from engine.request.request_values import RequestValues
from core.modules.drivers.models.agent_block import AgentBlock, OPEN_BLOCKS_REASON
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from engine.database.kept_rows import KeptRows


class OpenBlockRows:
    """An agent's open block rows, read once a request until a write changes them and kept between requests until
    they change: the view of its step and the lines that close a stale block share one read."""

    def __init__(self, queries: Queries, request_values: RequestValues, database: Database, hook_calls: HookCallQuery, kept: KeptRows) -> None:
        self.queries, self.request_values, self.database, self.hook_calls, self.kept = queries, request_values, database, hook_calls, kept

    def rows(self, agent_id: int) -> tuple[AgentBlock, ...]:
        return self.request_values.read(f"drivers.open-blocks:{agent_id}", self.database.change_mark, lambda: self.kept_rows(agent_id))

    def kept_rows(self, agent_id: int) -> tuple[AgentBlock, ...]:
        rows = self.queries.query(AgentBlock).filter(session_agent_id=agent_id, closed_at=None)
        return self.kept.read(rows, lambda: tuple(rows.every_row(OPEN_BLOCKS_REASON)), name="drivers.open-blocks")

    # the tool uses since each graced row opened, by row id: the view's holds and their countdown lines count them once
    def grace_uses(self, agent_id: int) -> dict[int, int]:
        return self.request_values.read(f"drivers.grace-uses:{agent_id}", self.database.change_mark, lambda: self.counted_uses(agent_id))

    def counted_uses(self, agent_id: int) -> dict[int, int]:
        counted = [row for row in self.rows(agent_id) if row.grace_tool_uses]
        return dict(zip([row.id for row in counted], self.hook_calls.tool_use_counts(agent_id, [row.creation_timestamp() for row in counted]))) if counted else {}
