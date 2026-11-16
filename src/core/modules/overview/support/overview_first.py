from engine.driver.block_agent import BlockAgent
from core.modules.overview.support.block_conditions.recent_overview_read import RecentOverviewRead
from core.modules.overview.support.overview_agent_messages import OVERVIEW_COMMAND
from core.modules.overview.agent_messages.overview_refusal_message import OverviewRefusalMessage


class OverviewFirst:
    """Whether an agent is blocked until it runs journal overview when its session starts or is compacted; only
    a story that is not about the overview turns this off."""

    is_required = True

    def block(self, agent_id: int) -> BlockAgent:
        return BlockAgent(agent_id, OverviewRefusalMessage.declared().agent_message(), RecentOverviewRead(OVERVIEW_COMMAND), strict=True)
