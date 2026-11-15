from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReaderWidthMessage(MessageTemplate):
    """The nudge processes.reader_too_wide."""

    key = "processes.reader_too_wide"
    type = AgentMessageType.STEERING
    text = "Reader {reader} kept {kept} of {lines} lines of output {output}: narrow it"
    required_command = "journal reader add {reader}"
