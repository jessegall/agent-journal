from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SavedCommandUnknownMessage(MessageTemplate):
    """The nudge aliases.saved_command_unknown."""

    key = "aliases.saved_command_unknown"
    type = AgentMessageType.REFUSAL
    text = "Save this command as an alias of category {category}, then run the alias"
