from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnreadableLiftedMessage(MessageTemplate):
    """The agent message processes.unreadable_lifted."""

    key = "processes.unreadable_lifted"
    type = AgentMessageType.STEERING
    text = "Command {name} prints readable lines again: reader requests resume"
