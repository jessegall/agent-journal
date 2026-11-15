from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SavedCommandUnreadMessage(MessageTemplate):
    """The nudge aliases.saved_command_unread."""

    key = "aliases.saved_command_unread"
    type = AgentMessageType.REFUSAL
    text = "journal {name} needs --tail, --head or --cut A-B: its full output is too long to read"
