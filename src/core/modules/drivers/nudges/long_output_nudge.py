from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class LongOutputNudge(NudgeDeclaration):
    """The nudge drivers.long_output."""

    key = "drivers.long_output"
    type = NudgeType.STEERING
    text = "That result was {lines} lines: read a range, or read the output by number, to keep your context small"
    interval = Interval(Seconds(600))
