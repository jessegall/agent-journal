from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PanicFileMessage(MessageTemplate):
    """The nudge drivers.panic_file."""

    key = "drivers.panic_file"
    type = AgentMessageType.SAFETY_REFUSAL
    text = "The panic file is only for a journal that does not answer: it answers you, so report what is wrong instead"
