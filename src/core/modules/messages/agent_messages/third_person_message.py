from engine.driver.message_template import MessageTemplate
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType


class ThirdPersonMessage(MessageTemplate):
    """The nudge messages.say_you."""

    key = "messages.say_you"
    type = AgentMessageType.STEERING
    text = "In the chat, say \"you\", never \"the user\""
    interval = Interval(Seconds(600))
