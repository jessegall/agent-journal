from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class JournalLawsMessage(MessageTemplate):
    """The agent message messages.journal_laws."""

    key = "messages.journal_laws"
    type = AgentMessageType.NOTICE
    text = "Laws L1 to L11 in JOURNAL.md apply to you"
