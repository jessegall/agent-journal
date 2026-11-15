from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class ThirdPersonNudge(NudgeDeclaration):
    """The nudge messages.say_you."""

    key = "messages.say_you"
    type = NudgeType.STEERING
    text = "In the chat, say \"you\", never \"the user\""
    interval = Interval(Seconds(600))
