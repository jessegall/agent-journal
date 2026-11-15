from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class HandMadeMonitorMessage(MessageTemplate):
    """The agent message processes.hand_made_monitor."""

    key = "processes.hand_made_monitor"
    type = AgentMessageType.REFUSAL
    text = "Do not write your own wait on an output: give the output wait to the Monitor"
