from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SkipApprovedMessage(MessageTemplate):
    """The nudge drivers.skip_approved."""

    key = "drivers.skip_approved"
    type = AgentMessageType.STEERING
    text = "Skip refusal-skip:{refusal} approved: try again"
    turn_limited = False
