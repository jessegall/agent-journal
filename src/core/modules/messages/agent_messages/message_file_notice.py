from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MessageFileNotice(MessageTemplate):
    """The agent message messages.message_file."""

    key = "messages.message_file"
    type = AgentMessageType.STEERING
    text = '  file .journal/files/message/{message}/{name}'
    turn_limited = False
