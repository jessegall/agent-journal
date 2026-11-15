from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ExternalJournalLineMessage(MessageTemplate):
    """The agent message drivers.outward_journal_line."""

    key = "drivers.outward_journal_line"
    type = AgentMessageType.SAFETY_REFUSAL
    text = "This command reaches outside the journal: say in your report what should be run"
