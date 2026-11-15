from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TaskFiledKeepCurrentNudge(NudgeDeclaration):
    """The nudge tasks.filed_keep_current."""

    key = "tasks.filed_keep_current"
    type = NudgeType.STEERING
    text = "Filed: continue task:{task} and leave the new one open"
    turn_limited = False
