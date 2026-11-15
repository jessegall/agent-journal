from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnjudgedLineMessage(MessageTemplate):
    """The nudge drivers.unjudged_line."""

    key = "drivers.unjudged_line"
    type = AgentMessageType.SAFETY_REFUSAL
    text = "This line cannot be judged from its text: read with grep, or say in your report what should be run"
