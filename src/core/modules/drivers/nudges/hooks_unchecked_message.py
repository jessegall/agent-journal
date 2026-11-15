from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class HooksUncheckedMessage(MessageTemplate):
    """The nudge drivers.hooks_unchecked."""

    key = "drivers.hooks_unchecked"
    type = AgentMessageType.STEERING
    text = "{count} of your hooks ran unchecked while the journal was not answering: review what you ran then"
