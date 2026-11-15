from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnreadableEmptyMessage(MessageTemplate):
    """The agent message processes.unreadable_empty."""

    key = "processes.unreadable_empty"
    type = AgentMessageType.STEERING
    text = "Output {output} printed nothing: its exit code is the result, so no reader is needed"
