from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SkipDeclinedMessage(MessageTemplate):
    """The agent message drivers.skip_declined."""

    key = "drivers.skip_declined"
    type = AgentMessageType.STEERING
    text = "Skip refusal-skip:{refusal} declined: do what the refusal asks"
    turn_limited = False
