from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReaderSummaryMissingMessage(MessageTemplate):
    """The agent message processes.reader_no_summary."""

    key = "processes.reader_no_summary"
    type = AgentMessageType.STEERING
    text = "Reader {reader} found no summary in output {output}"
    required_command = "journal reader add {reader}"
