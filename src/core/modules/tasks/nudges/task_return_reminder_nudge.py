from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TaskReturnReminderNudge(NudgeDeclaration):
    """The nudge tasks.task_still_held."""

    key = "tasks.task_still_held"
    type = NudgeType.STEERING
    text = "Back to task:{task}: continue, close or release it"
    turn_limited = False
