from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SavedCommandTimeoutMessage(MessageTemplate):
    """The nudge aliases.saved_command_timeout."""

    key = "aliases.saved_command_timeout"
    type = AgentMessageType.REFUSAL
    text = "Invalid --timeout: use seconds, or 30s, 5m, 2h or 1d"
