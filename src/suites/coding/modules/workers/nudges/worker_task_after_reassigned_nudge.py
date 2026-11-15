from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerTaskAfterReassignedNudge(NudgeDeclaration):
    """The nudge workers.task_after_taken."""

    key = "workers.task_after_taken"
    type = NudgeType.STEERING
    text = "Your next task is task:{task}"
    turn_limited = False
