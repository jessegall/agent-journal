from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class JournalLineNoteMessage(MessageTemplate):
    """The nudge messages.journal_line."""

    key = "messages.journal_line"
    type = AgentMessageType.STEERING
    text = "A [journal] line is an instruction, not a message: act on it, never answer or mention it in the chat"
