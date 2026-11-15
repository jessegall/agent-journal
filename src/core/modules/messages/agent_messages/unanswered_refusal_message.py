from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnansweredRefusalMessage(MessageTemplate):
    """The agent message messages.unanswered_held."""

    key = "messages.unanswered_held"
    type = AgentMessageType.REFUSAL
    text = "Answer message {messages} first"
    turn_limited = False
