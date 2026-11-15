from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class PlainCodeNudge(NudgeDeclaration):
    """The nudge messages.plain_code."""

    key = "messages.plain_code"
    type = NudgeType.STEERING
    text = "In code, name identifiers and text literally: say plainly what a thing is or does"
    interval = Interval(Seconds(1800))
