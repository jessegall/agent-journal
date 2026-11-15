from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class OutputStoppedMessage(MessageTemplate):
    """The nudge processes.output_stopped."""

    key = "processes.output_stopped"
    type = AgentMessageType.STEERING
    text = "Output {output} was stopped partway: its output is kept, read what it printed so far"
