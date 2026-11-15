from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class HelperTypeCategoryMessage(MessageTemplate):
    """The nudge drivers.helper_type_category."""

    key = "drivers.helper_type_category"
    type = AgentMessageType.REFUSAL
    text = "a {helper_type} here runs no {category} command{hint}"
    full_text = True
