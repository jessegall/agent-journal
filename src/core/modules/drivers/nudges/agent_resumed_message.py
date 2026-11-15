from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class AgentResumedMessage(MessageTemplate):
    """The nudge drivers.resumed."""

    key = "drivers.resumed"
    type = AgentMessageType.STEERING
    text = "The user resumed you: continue where you stopped"
