from engine.driver.open_hold import OpenHold
from core.modules.overview.support.block_conditions.recent_overview_read import RecentOverviewRead
from core.modules.overview.support.overview_nudges import OVERVIEW_COMMAND
from core.modules.overview.nudges.overview_refusal_nudge import OverviewRefusalNudge


class OverviewFirst:
    """Whether an agent is blocked until it runs journal overview when its session starts or is compacted; only
    a story that is not about the overview turns this off."""

    is_required = True

    def block(self, agent_id: int) -> OpenHold:
        return OpenHold(agent_id, OverviewRefusalNudge.declared().nudge(), RecentOverviewRead(OVERVIEW_COMMAND), strict=True)
