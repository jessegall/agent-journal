from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class IdleWorkerTasksNudge(NudgeDeclaration):
    """The nudge workers.idle_worker_tasks."""

    key = "workers.idle_worker_tasks"
    type = NudgeType.STEERING
    text = "worker:{worker} has stopped and holds {tasks}"
    turn_limited = False
