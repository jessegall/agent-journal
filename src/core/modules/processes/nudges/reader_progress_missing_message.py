from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReaderProgressMissingMessage(MessageTemplate):
    """The nudge processes.reader_no_progress."""

    key = "processes.reader_no_progress"
    type = AgentMessageType.STEERING
    text = "Output {output} showed no progress: give reader {reader} a --progress or --step pattern"
