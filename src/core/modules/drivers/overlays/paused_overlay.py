from collections.abc import Sequence

from engine.driver.open_row import OpenRow
from engine.driver.overlay import Overlay
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.rules.paused_agent_rule import PausedAgentRule


class PausedOverlay(Overlay):
    """A paused agent, or any agent it started, a worker or a helper, and theirs in turn: its tools are refused
    and every ordinary rule is silent, so it may stop, is given no new work and is told nothing until it is
    resumed."""

    name = "drivers.paused"
    exclusive = True
    pauses_agent = True
    delays_lines = True
    rules = [PausedAgentRule]

    def __init__(self, agents: AgentRows) -> None:
        self.agents = agents

    def open_agent_rows(self, agent_id: int) -> Sequence[OpenRow]:
        holder = self.agents.pause_holder(agent_id)
        return [OpenRow("agent", holder.id, holder.paused_at)] if holder.paused_at is not None else []
