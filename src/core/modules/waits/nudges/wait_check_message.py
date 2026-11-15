from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class WaitCheckMessage(MessageTemplate):
    """The nudge waits.check_the_wait."""

    key = "waits.check_the_wait"
    type = AgentMessageType.STEERING
    text = "You have waited {minutes} min on wait:{wait}: check it does what you expect"
    interval = Interval(Seconds(300))
