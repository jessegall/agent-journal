from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MainHelperBanMessage(MessageTemplate):
    """The nudge coding.main_starts_no_helpers."""

    key = "coding.main_starts_no_helpers"
    type = AgentMessageType.REFUSAL
    text = "The main agent starts no read-only helpers here: {then}"
