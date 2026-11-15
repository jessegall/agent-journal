from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerReuseNudge(NudgeDeclaration):
    """The nudge workers.reuse."""

    key = "workers.reuse"
    type = NudgeType.REFUSAL
    text = "worker:{worker} changed these files: send it the job, or give a reason for a new worker"
    turn_limited = False
