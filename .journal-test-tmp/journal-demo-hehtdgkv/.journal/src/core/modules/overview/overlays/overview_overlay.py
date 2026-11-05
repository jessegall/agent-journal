from collections.abc import Sequence

from core.base.driver.open_row import OpenRow
from core.base.driver.overlay import Overlay
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.overview.support.overview_nudges import OVERVIEW_REFUSAL


class OverviewOverlay(Overlay):
    """An agent that must run journal overview is told nothing else until it has, since the overview shows it
    all; its waiting lines and messages reach it afterwards."""

    name = "overview.waiting"
    exclusive = True
    delays_lines = True
    delays_notices = True

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def open_rows(self, agent_id: int) -> Sequence[OpenRow]:
        blocks = self.queries.query(AgentBlock).filter(agent_id=agent_id, nudge_key=OVERVIEW_REFUSAL.key).matching(IsNull("closed_at")).oldest().limited(1)
        return [OpenRow("agent_block", block.id, block.creation_timestamp()) for block in blocks]
