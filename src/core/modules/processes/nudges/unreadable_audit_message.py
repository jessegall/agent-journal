from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnreadableAuditMessage(MessageTemplate):
    """The nudge processes.unreadable_audit."""

    key = "processes.unreadable_audit"
    type = AgentMessageType.STEERING
    text = "{count} commands are marked unreadable by agents: review them in the viewer"
