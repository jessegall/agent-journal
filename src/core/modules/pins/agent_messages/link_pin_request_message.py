from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.enums.agent_message_type import AgentMessageType
from core.modules.drivers.models.support.tool_use_window import ToolUseWindow

PIN_REQUEST_TOOL_USES = 50


class LinkPinRequestMessage(MessageTemplate):
    """The nudge pins.pin_the_link."""

    key = "pins.pin_the_link"
    type = AgentMessageType.STEERING
    text = "Pin this link if the user will come back to it: {url}"
    interval = Interval(ToolUseWindow(PIN_REQUEST_TOOL_USES))
