from core.base.driver.block_until import BlockUntil
from core.base.driver.conditions.ran_command import RanCommand
from core.modules.overview.support.overview_nudges import OVERVIEW_COMMAND, OVERVIEW_REFUSAL


class OverviewFirst:
    """Whether an agent is blocked until it runs journal overview when its session starts or is compacted; only
    a story that is not about the overview turns this off."""

    is_required = True

    def block(self, agent_id: int) -> BlockUntil:
        return BlockUntil(agent_id, OVERVIEW_REFUSAL.nudge(), RanCommand(OVERVIEW_COMMAND), strict=True)
