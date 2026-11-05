from collections.abc import Sequence

from core.base.agent_role import AgentRole
from core.base.driver.open_row import OpenRow
from core.base.driver.overlay import Overlay
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.rules.paused_agent_rule import PausedAgentRule


class PausedOverlay(Overlay):
    """A paused agent, or a helper of one: its tools are refused and every ordinary rule is silent, so it
    may stop, is given no new work and is told nothing until it is resumed."""

    name = "drivers.paused"
    exclusive = True
    delays_lines = True
    rules = [PausedAgentRule]

    def __init__(self, agents: AgentRows) -> None:
        self.agents = agents

    def open_rows(self, agent_id: int) -> Sequence[OpenRow]:
        agent = self.agents.find(agent_id)
        holder = self.agents.find(agent.parent_id) if agent.role == AgentRole.HELPER and agent.parent_id is not None else agent
        return [OpenRow("agent", holder.id, holder.paused_at)] if holder.paused_at is not None else []
