from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReplyNoteMessage(MessageTemplate):
    """The agent message messages.reply_note."""

    key = "messages.reply_note"
    type = AgentMessageType.STEERING
    text = "Message {message} answered: continue"
    turn_limited = False
