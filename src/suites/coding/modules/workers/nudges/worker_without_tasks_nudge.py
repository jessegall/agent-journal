from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerWithoutTasksNudge(NudgeDeclaration):
    """The nudge workers.worker_without_tasks."""

    key = "workers.worker_without_tasks"
    type = NudgeType.STEERING
    text = "worker:{worker} has no task left after its merge and stopped: it takes your next batch"
    wakes_agent = True
