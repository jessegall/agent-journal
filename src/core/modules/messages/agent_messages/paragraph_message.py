from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class ParagraphMessage(MessageTemplate):
    """The agent message messages.blank_lines."""

    key = "messages.blank_lines"
    type = AgentMessageType.STEERING
    text = "Separate paragraphs with a blank line"
    interval = Interval(Seconds(600))
