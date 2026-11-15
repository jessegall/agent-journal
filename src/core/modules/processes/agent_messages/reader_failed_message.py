from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReaderFailedMessage(MessageTemplate):
    """The agent message processes.reader_failed."""

    key = "processes.reader_failed"
    type = AgentMessageType.STEERING
    text = "Reader {reader} failed on output {output}; the full output stays readable"
