from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SkipApprovedMessage(MessageTemplate):
    """The agent message drivers.skip_approved."""

    key = "drivers.skip_approved"
    type = AgentMessageType.STEERING
    text = "Skip driver-grant:{refusal} approved: try again"
    turn_limited = False
