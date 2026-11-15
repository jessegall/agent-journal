from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SequenceUnfinishedMessage(MessageTemplate):
    """The agent message sequences.unfinished_at_stop."""

    key = "sequences.unfinished_at_stop"
    type = AgentMessageType.REFUSAL
    text = "sequence:{sequence} step {step} is not finished: finish it before you stop"
