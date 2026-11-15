from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WaitingItemsMessage(MessageTemplate):
    """The agent message coding.waiting_items."""

    key = "coding.waiting_items"
    type = AgentMessageType.STEERING
    text = "Waiting on you: {items}"
