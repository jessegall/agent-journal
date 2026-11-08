from core.base.driver.interval import Interval
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan

NUDGE_TOOL_USES = 9  # the nine tool uses between two nudges make it the tenth search after one in a row of searches
USE_GRAPHIFY = NudgeDeclaration("tools.use_graphify", NudgeType.STEERING, "{count} searches of the code without Graphify: use graphify query, path or explain",
                                interval=Interval(ToolUseSpan(NUDGE_TOOL_USES)), turn_limited=False)
GRAPHIFY_FIRST = NudgeDeclaration("tools.graphify_first", NudgeType.REFUSAL, "{count} searches of the code without Graphify: use graphify query, path or explain first", turn_limited=False)

TOOL_NUDGES = [USE_GRAPHIFY, GRAPHIFY_FIRST]
