from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TaskAssignmentNudge(NudgeDeclaration):
    """The nudge coding.task_is_yours."""

    key = "coding.task_is_yours"
    type = NudgeType.REFUSAL
    text = 'task:{task} is yours now'
