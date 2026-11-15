from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class WaitCheckNudge(NudgeDeclaration):
    """The nudge waits.check_the_wait."""

    key = "waits.check_the_wait"
    type = NudgeType.STEERING
    text = "You have waited {minutes} min on wait:{wait}: check it does what you expect"
    interval = Interval(Seconds(300))
