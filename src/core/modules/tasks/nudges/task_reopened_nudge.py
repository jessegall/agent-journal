from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TaskReopenedNudge(NudgeDeclaration):
    """The nudge tasks.open_again."""

    key = "tasks.open_again"
    type = NudgeType.STEERING
    text = "task:{task} is open again: what it waited on has ended"
