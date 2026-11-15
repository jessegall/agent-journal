from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ActiveOutputMessage(MessageTemplate):
    """The nudge processes.output_running."""

    key = "processes.output_running"
    type = AgentMessageType.STEERING
    text = "Output {output}: running"
