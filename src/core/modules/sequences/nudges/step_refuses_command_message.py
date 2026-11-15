from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class StepRefusesCommandMessage(MessageTemplate):
    """The nudge sequences.step_refuses_command."""

    key = "sequences.step_refuses_command"
    type = AgentMessageType.REFUSAL
    text = "Step {step} of sequence:{sequence} does not allow this command"
