from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SavedCommandMixedMessage(MessageTemplate):
    """The nudge aliases.saved_command_mixed."""

    key = "aliases.saved_command_mixed"
    type = AgentMessageType.REFUSAL
    text = "Run a test or build on its own line, separate from other commands"
