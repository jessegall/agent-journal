from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class BangButtonRequestMessage(MessageTemplate):
    """The nudge pins.pin_the_bang_command."""

    key = "pins.pin_the_bang_command"
    type = AgentMessageType.STEERING
    text = "A pin can hold a button that runs your ! command in your terminal"
    interval = Interval(Seconds(300))
