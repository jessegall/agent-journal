from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.query.query import Query
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.overview.support.overview_nudges import OVERVIEW_REFUSAL


class OverviewBlocks:
    """The open block that holds an agent until it runs journal overview."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def open_blocks(self, agent_id: int) -> Query[AgentBlock]:
        return self.queries.query(AgentBlock).filter(session_agent_id=agent_id, nudge_key=OVERVIEW_REFUSAL.key).matching(IsNull("closed_at"))

    def oldest_open(self, agent_id: int) -> AgentBlock | None:
        return self.open_blocks(agent_id).oldest().first()

    def is_blocked(self, agent_id: int) -> bool:
        return self.open_blocks(agent_id).exists()
