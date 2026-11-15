from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MessageUpdatedNotice(MessageTemplate):
    """The agent message messages.message_updated."""

    key = "messages.message_updated"
    type = AgentMessageType.NOTICE
    text = "message:{message} was updated: read it again"
