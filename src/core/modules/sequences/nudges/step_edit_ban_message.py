from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class StepEditBanMessage(MessageTemplate):
    """The nudge sequences.step_holds_edits."""

    key = "sequences.step_holds_edits"
    type = AgentMessageType.REFUSAL
    text = "Step {step} of sequence:{sequence} blocks file edits"
