from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class DatabaseFileMessage(MessageTemplate):
    """The nudge drivers.database_file."""

    key = "drivers.database_file"
    type = AgentMessageType.SAFETY_REFUSAL
    text = "The journal's database changes only through journal commands: find yours with journal --help, or report what is missing"
    full_text = True
