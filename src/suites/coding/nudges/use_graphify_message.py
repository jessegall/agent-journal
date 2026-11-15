from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.enums.agent_message_type import AgentMessageType
from core.modules.drivers.models.support.tool_use_window import ToolUseWindow

NUDGE_TOOL_USES = 9  # the nine tool uses between two nudges make it the tenth search after one in a row of searches


class UseGraphifyMessage(MessageTemplate):
    """The nudge tools.use_graphify."""

    key = "tools.use_graphify"
    type = AgentMessageType.STEERING
    text = "{count} searches without Graphify: run graphify query with 2 to 4 code names, then explain one"
    interval = Interval(ToolUseWindow(NUDGE_TOOL_USES))
    turn_limited = False
