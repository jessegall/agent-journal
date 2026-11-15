from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class DocumentOpenMessage(MessageTemplate):
    """The agent message documents.open-document."""

    key = "documents.open-document"
    type = AgentMessageType.REFUSAL
    text = "doc:{doc} is open: close it before editing files"
