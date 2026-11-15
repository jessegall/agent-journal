from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReaderMissedMessage(MessageTemplate):
    """The agent message processes.reader_missed."""

    key = "processes.reader_missed"
    type = AgentMessageType.STEERING
    text = "Reader {reader} matched none of the {lines} lines of output {output}: fix it"
    required_command = "journal reader add {reader}"
