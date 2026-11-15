from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class JournalCommandLastMessage(MessageTemplate):
    """The agent message processes.journal_command_last."""

    key = "processes.journal_command_last"
    type = AgentMessageType.REFUSAL
    text = "A journal command cannot follow a long command or run in a loop: put it on its own line"
