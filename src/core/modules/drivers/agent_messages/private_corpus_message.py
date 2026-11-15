from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PrivateCorpusMessage(MessageTemplate):
    """The agent message drivers.private_corpus."""

    key = "drivers.private_corpus"
    type = AgentMessageType.SAFETY_REFUSAL
    text = "The private command corpus is only read or run in its sandboxed go test: say in your report what you need"
