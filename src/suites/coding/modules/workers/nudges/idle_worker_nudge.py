from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class IdleWorkerNudge(NudgeDeclaration):
    """The nudge workers.idle_worker."""

    key = "workers.idle_worker"
    type = NudgeType.STEERING
    text = "worker:{worker} has stopped"
    turn_limited = False
