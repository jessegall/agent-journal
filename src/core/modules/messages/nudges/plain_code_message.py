from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class PlainCodeMessage(MessageTemplate):
    """The nudge messages.plain_code."""

    key = "messages.plain_code"
    type = AgentMessageType.STEERING
    text = "In code, name identifiers and text literally: say plainly what a thing is or does"
    interval = Interval(Seconds(1800))
