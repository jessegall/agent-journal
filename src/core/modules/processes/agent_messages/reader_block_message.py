from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReaderBlockMessage(MessageTemplate):
    """The agent message processes.reader_block."""

    key = "processes.reader_block"
    type = AgentMessageType.REFUSAL
    text = "Output {output} has no reader, request {request}: run journal reader draft {request} --save, or mark it unreadable"
    full_text = True
