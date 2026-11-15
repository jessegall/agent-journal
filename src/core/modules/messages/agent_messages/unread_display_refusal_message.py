from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnreadDisplayRefusalMessage(MessageTemplate):
    """The agent message messages.unread_show."""

    key = "messages.unread_show"
    type = AgentMessageType.REFUSAL
    text = "Message {message} is unread, so it cannot be shown: read it first"
