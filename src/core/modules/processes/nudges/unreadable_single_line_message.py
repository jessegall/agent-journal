from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnreadableSingleLineMessage(MessageTemplate):
    """The nudge processes.unreadable_single_line."""

    key = "processes.unreadable_single_line"
    type = AgentMessageType.STEERING
    text = "Output {output} is one redrawn line: read it with a script reader that splits on carriage returns, or mark it unreadable"
