from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class LargeOutputReadNudge(NudgeDeclaration):
    """The nudge processes.large_output_read."""

    key = "processes.large_output_read"
    type = NudgeType.STEERING
    text = "Output {output} has {lines} lines: read it with --summary, --tail K or --lines A-B"
    interval = Interval(Seconds(604800))
