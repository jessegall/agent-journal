from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class RepeatedClosingMessage(MessageTemplate):
    """The agent message messages.repeated_closing."""

    key = "messages.repeated_closing"
    type = AgentMessageType.STEERING
    text = "Your closing words repeat message {message}, so they were not shown"
