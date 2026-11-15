from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerIdleStoppedNudge(NudgeDeclaration):
    """The nudge workers.worker_idle_stopped."""

    key = "workers.worker_idle_stopped"
    type = NudgeType.STEERING
    text = "worker:{worker} was idle too long and its process stopped; task:{task} stays with it"
    turn_limited = False
