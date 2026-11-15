from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ProcessMissingMessage(MessageTemplate):
    """The nudge processes.process_lost."""

    key = "processes.process_lost"
    type = AgentMessageType.STEERING
    text = "Process {process} was lost: its shell is gone"
