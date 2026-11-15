from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnreadRefusalMessage(MessageTemplate):
    """The agent message messages.unread_held."""

    key = "messages.unread_held"
    type = AgentMessageType.REFUSAL
    text = "{count} unread messages: read them before any other write"
    turn_limited = False
