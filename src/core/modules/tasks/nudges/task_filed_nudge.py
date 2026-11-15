from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TaskFiledNudge(NudgeDeclaration):
    """The nudge tasks.filed."""

    key = "tasks.filed"
    type = NudgeType.STEERING
    text = "Filed: leave it open, do not start it"
    turn_limited = False
