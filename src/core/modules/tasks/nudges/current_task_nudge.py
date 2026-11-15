from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class CurrentTaskNudge(NudgeDeclaration):
    """The nudge tasks.task_in_hand."""

    key = "tasks.task_in_hand"
    type = NudgeType.STEERING
    text = 'task:{task} is in hand'
    turn_limited = False
