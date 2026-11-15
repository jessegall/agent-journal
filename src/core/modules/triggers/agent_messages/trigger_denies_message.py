from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TriggerDeniesMessage(MessageTemplate):
    """The nudge triggers.trigger_denies."""

    key = "triggers.trigger_denies"
    type = AgentMessageType.REFUSAL
    text = 'trigger:{trigger} denies this'
