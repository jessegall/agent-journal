from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReaderRequestRefusalMessage(MessageTemplate):
    """The agent message processes.reader_request_refusal."""

    key = "processes.reader_request_refusal"
    type = AgentMessageType.REFUSAL
    text = "Reader request {request} needs a reader first"
