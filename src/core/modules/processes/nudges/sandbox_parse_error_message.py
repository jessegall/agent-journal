from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SandboxParseErrorMessage(MessageTemplate):
    """The nudge processes.sandbox_parse_error."""

    key = "processes.sandbox_parse_error"
    type = AgentMessageType.REFUSAL
    text = "The read-only sandbox cannot run an unparsed line: split it into simpler commands"
