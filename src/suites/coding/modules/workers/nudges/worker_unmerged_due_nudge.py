from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType


class WorkerUnmergedDueNudge(NudgeDeclaration):
    """The nudge workers.worker_unmerged_due."""

    key = "workers.worker_unmerged_due"
    type = NudgeType.STEERING
    text = "worker:{worker} committed {tasks}, not merged: {action}"
    interval = Interval(Seconds(300))
    turn_limited = False
    wakes_agent = True
    required_command = "journal worker merge {worker}"
