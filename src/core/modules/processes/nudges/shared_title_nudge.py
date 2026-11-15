from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class SharedTitleNudge(NudgeDeclaration):
    """The nudge processes.shared_title."""

    key = "processes.shared_title"
    type = NudgeType.STEERING
    text = "Outputs {outputs} share one title: give each its own"
    interval = Interval(Seconds(600))
