from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class LongOutputMessage(MessageTemplate):
    """The nudge drivers.long_output."""

    key = "drivers.long_output"
    type = AgentMessageType.STEERING
    text = "That result was {lines} lines: read a range, or read the output by number, to keep your context small"
    interval = Interval(Seconds(600))
