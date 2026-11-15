from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MissedLogMessage(MessageTemplate):
    """The agent message tasks.missed_log."""

    key = "tasks.missed_log"
    type = AgentMessageType.STEERING
    text = "Log what the summary missed"
