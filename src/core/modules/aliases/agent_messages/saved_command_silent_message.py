from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SavedCommandSilentMessage(MessageTemplate):
    """The agent message aliases.saved_command_silent."""

    key = "aliases.saved_command_silent"
    type = AgentMessageType.REFUSAL
    text = "Alias {name} printed nothing for 30s on its last run: make it print each step, then rerun it"
