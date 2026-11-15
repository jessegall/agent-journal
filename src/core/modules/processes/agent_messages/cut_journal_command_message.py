from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class CutJournalCommandMessage(MessageTemplate):
    """The agent message processes.cut_journal_command."""

    key = "processes.cut_journal_command"
    type = AgentMessageType.REFUSAL
    text = "Do not pipe a journal command: use its flags"
