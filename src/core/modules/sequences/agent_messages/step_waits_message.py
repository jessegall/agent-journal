from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class StepWaitsMessage(MessageTemplate):
    """The agent message sequences.step_waits."""

    key = "sequences.step_waits"
    type = AgentMessageType.REFUSAL
    text = "sequence:{sequence} step {step} is waiting"
