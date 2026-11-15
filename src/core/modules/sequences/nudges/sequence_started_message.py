from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SequenceStartedMessage(MessageTemplate):
    """The nudge sequences.started."""

    key = "sequences.started"
    type = AgentMessageType.STEERING
    text = "sequence:{sequence} was started by what just happened"
