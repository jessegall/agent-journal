from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerTaskNudge(NudgeDeclaration):
    """The nudge workers.worker_holds_task."""

    key = "workers.worker_holds_task"
    type = NudgeType.STEERING
    text = 'worker:{worker} has task:{task}'
