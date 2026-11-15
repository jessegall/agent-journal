from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerTaskReassignedNudge(NudgeDeclaration):
    """The nudge workers.task_taken."""

    key = "workers.task_taken"
    type = NudgeType.STEERING
    text = 'task:{task} was taken from you: leave it'
    turn_limited = False
