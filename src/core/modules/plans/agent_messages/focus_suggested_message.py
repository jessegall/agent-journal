from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class FocusSuggestedMessage(MessageTemplate):
    """The agent message plans.focus_suggested."""

    key = "plans.focus_suggested"
    type = AgentMessageType.NOTICE
    text = "Plans {plans} started; your default focus is plan {focus}"
    turn_limited = False
