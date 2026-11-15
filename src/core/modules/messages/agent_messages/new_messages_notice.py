from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class NewMessagesNotice(MessageTemplate):
    """The agent message messages.new_messages."""

    key = "messages.new_messages"
    type = AgentMessageType.STEERING
    text = "{count} new messages: read them"
    turn_limited = False
