from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReadonlyMessage(MessageTemplate):
    """The agent message drivers.readonly."""

    key = "drivers.readonly"
    type = AgentMessageType.SAFETY_REFUSAL
    text = "This driver only reads and searches, plus journal commands"
