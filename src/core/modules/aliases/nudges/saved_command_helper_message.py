from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SavedCommandHelperMessage(MessageTemplate):
    """The nudge aliases.saved_command_helper."""

    key = "aliases.saved_command_helper"
    type = AgentMessageType.REFUSAL
    text = "Read-only helpers only read: ask your parent to save an alias for this {category}"
