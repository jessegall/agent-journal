from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnreadableDeclarationMessage(MessageTemplate):
    """The nudge processes.unreadable_declared."""

    key = "processes.unreadable_declared"
    type = AgentMessageType.STEERING
    text = "Command {name} was marked unreadable"
