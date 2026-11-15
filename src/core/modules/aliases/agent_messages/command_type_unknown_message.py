from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class CommandTypeUnknownMessage(MessageTemplate):
    """The agent message aliases.command_type_unknown."""

    key = "aliases.command_type_unknown"
    type = AgentMessageType.REFUSAL
    text = "{program} has an unknown command type: {hint}"
