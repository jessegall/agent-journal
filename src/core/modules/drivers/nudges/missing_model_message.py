from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MissingModelMessage(MessageTemplate):
    """The nudge drivers.missing_model."""

    key = "drivers.missing_model"
    type = AgentMessageType.REFUSAL
    text = "Name a model in the dispatch: the cheapest one that reliably fits the work"
    turn_limited = False
