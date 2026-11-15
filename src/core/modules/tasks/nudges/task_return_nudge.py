from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TaskReturnNudge(NudgeDeclaration):
    """The nudge tasks.back_to_task."""

    key = "tasks.back_to_task"
    type = NudgeType.STEERING
    text = "Back to task:{task}"
    turn_limited = False
