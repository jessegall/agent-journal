from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SavedCommandChoicesMessage(MessageTemplate):
    """The nudge aliases.saved_command_choices."""

    key = "aliases.saved_command_choices"
    type = AgentMessageType.REFUSAL
    text = "Run this through a saved {category} alias, with --tail, --head or --cut"
