from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class FreezeLiftedMessage(MessageTemplate):
    """The nudge processes.hold_lifted."""

    key = "processes.hold_lifted"
    type = AgentMessageType.STEERING
    text = "A user lifted the hold on output {output}"
