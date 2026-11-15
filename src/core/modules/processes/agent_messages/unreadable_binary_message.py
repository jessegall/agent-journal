from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnreadableBinaryMessage(MessageTemplate):
    """The nudge processes.unreadable_binary."""

    key = "processes.unreadable_binary"
    type = AgentMessageType.STEERING
    text = "Output {output} is binary: use a tool made for it"
