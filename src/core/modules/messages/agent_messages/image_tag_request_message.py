from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ImageTagRequestMessage(MessageTemplate):
    """The nudge messages.tag_the_image."""

    key = "messages.tag_the_image"
    type = AgentMessageType.STEERING
    text = "message:{message} has image \"{name}\": tag it with what it shows"
    required_command = "journal message tag {message}"
