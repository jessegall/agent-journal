from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SilentStartFixedMessage(MessageTemplate):
    """The agent message processes.silent_start_fixed."""

    key = "processes.silent_start_fixed"
    type = AgentMessageType.STEERING
    text = "{name} now shows its progress in the chat"
