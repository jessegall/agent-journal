from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MessageNoteNotice(MessageTemplate):
    """The agent message messages.act_on_messages."""

    key = "messages.act_on_messages"
    type = AgentMessageType.NOTICE
    text = 'Act on the message: follow steering, create a task or edit an existing one, save memories worth keeping, then reply'
    turn_limited = False
