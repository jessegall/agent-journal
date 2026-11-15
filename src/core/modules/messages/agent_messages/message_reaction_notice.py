from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MessageReactionNotice(MessageTemplate):
    """The agent message messages.reaction."""

    key = "messages.reaction"
    delivery = LineDelivery.WAKE_HOOK
    type = AgentMessageType.STEERING
    text = "The user reacted to message:{message}: check the reaction"
    wakes_agent = True
    plural_text = "the user reacted to messages {message}"
    id_field = "message"
