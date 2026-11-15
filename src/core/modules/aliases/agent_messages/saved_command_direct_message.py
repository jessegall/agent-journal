from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SavedCommandDirectMessage(MessageTemplate):
    """The agent message aliases.saved_command_direct."""

    key = "aliases.saved_command_direct"
    type = AgentMessageType.REFUSAL
    text = "This is a saved command: run journal {name} --tail 20"
