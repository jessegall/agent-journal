from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class UpdateWaitingNudge(NudgeDeclaration):
    """The nudge processes.update_waiting."""

    key = "processes.update_waiting"
    type = NudgeType.STEERING
    text = "An update waits for {outputs} to end: no new command starts until it is done"
    interval = Interval(Seconds(300))
    turn_limited = False
