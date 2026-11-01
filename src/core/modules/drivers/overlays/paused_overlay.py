from collections.abc import Sequence

from core.base.driver.open_row import OpenRow
from core.base.driver.overlay import Overlay
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.drivers.rules.paused_agent_rule import PausedAgentRule


class PausedOverlay(Overlay):
    """A paused agent, or a subagent of one: its tools are refused and every ordinary rule is silent, so it may stop, is given no new work and is told nothing until it is resumed."""

    name = "drivers.paused"
    exclusive = True
    delays_lines = True
    rules = [PausedAgentRule]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def open_rows(self, agent_id: int) -> Sequence[OpenRow]:
        agent = self.queries.query(Agent).find(agent_id)
        holder = self.queries.query(Agent).find(agent.parent_id) if agent.parent_id is not None else agent
        return [OpenRow("agent", holder.id, holder.paused_at)] if holder.paused_at is not None else []
