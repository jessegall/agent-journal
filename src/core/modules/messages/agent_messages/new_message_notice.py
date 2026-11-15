from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class NewMessageNotice(MessageTemplate):
    """The agent message messages.new_message."""

    key = "messages.new_message"
    type = AgentMessageType.STEERING
    text = "New message {message}: read it"
    plural_text = "{count} new messages: read them"
    turn_limited = False
