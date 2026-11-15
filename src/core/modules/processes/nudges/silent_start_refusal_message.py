from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SilentStartRefusalMessage(MessageTemplate):
    """The nudge processes.silent_start_refused."""

    key = "processes.silent_start_refused"
    type = AgentMessageType.REFUSAL
    text = "{name} ran silent twice: add its reader, or skip once and say why no progress can be shown"
