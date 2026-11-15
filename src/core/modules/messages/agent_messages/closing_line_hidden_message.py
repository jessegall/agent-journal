from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ClosingLineHiddenMessage(MessageTemplate):
    """The agent message messages.one_line_closing."""

    key = "messages.one_line_closing"
    type = AgentMessageType.STEERING
    text = "Your reply was already sent, so your one closing line was not shown"
