from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class DocumentStopRefusalMessage(MessageTemplate):
    """The agent message documents.open-document-stop."""

    key = "documents.open-document-stop"
    type = AgentMessageType.REFUSAL
    text = "doc:{doc} is open: close it before you stop"
