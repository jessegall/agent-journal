from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class LimitedToolMessage(MessageTemplate):
    """The nudge drivers.limited_tool."""

    key = "drivers.limited_tool"
    type = AgentMessageType.SAFETY_REFUSAL
    text = "Read-only agents have no {tool}: say in your report what you need"
