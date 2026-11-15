from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnreadMessageStopNotice(MessageTemplate):
    """The agent message messages.unread_at_stop."""

    key = "messages.unread_at_stop"
    type = AgentMessageType.REFUSAL
    text = "Message {message} is unread: read it before you stop"
