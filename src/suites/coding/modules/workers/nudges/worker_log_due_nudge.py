from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class WorkerLogDueNudge(NudgeDeclaration):
    """The nudge workers.worker_log_due."""

    key = "workers.worker_log_due"
    type = NudgeType.STEERING
    text = "Nothing logged for {minutes} min: log where you stand"
    interval = Interval(Seconds(1800))
    turn_limited = False
