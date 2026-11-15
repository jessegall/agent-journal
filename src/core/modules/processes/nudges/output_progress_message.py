from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class OutputProgressMessage(MessageTemplate):
    """The nudge processes.output_progress."""

    key = "processes.output_progress"
    type = AgentMessageType.STEERING
    text = "Output {output}: {percent}%"
