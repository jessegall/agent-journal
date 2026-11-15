from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SavedCommandPipedMessage(MessageTemplate):
    """The agent message aliases.saved_command_piped."""

    key = "aliases.saved_command_piped"
    type = AgentMessageType.REFUSAL
    text = "journal {name} takes no pipe: use --tail, --head or --cut A-B; the full output is kept"
