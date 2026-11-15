from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.enums.nudge_type import NudgeType
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan

NUDGE_TOOL_USES = 9  # the nine tool uses between two nudges make it the tenth search after one in a row of searches


class UseGraphifyNudge(NudgeDeclaration):
    """The nudge tools.use_graphify."""

    key = "tools.use_graphify"
    type = NudgeType.STEERING
    text = "{count} searches without Graphify: run graphify query with 2 to 4 code names, then explain one"
    interval = Interval(ToolUseSpan(NUDGE_TOOL_USES))
    turn_limited = False
