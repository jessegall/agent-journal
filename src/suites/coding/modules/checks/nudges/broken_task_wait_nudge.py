from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class BrokenTaskWaitNudge(NudgeDeclaration):
    """The nudge checks.broken_task_wait."""

    key = "checks.broken_task_wait"
    type = NudgeType.STEERING
    text = "task:{task} waits on a command that cannot run: fix or change the wait"
    interval = Interval(Seconds(1800))
