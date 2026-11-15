from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class InactiveTaskNudge(NudgeDeclaration):
    """The nudge tasks.inactive_task."""

    key = "tasks.inactive_task"
    type = NudgeType.STEERING
    text = "Nothing happened for {minutes} min: continue task:{task}, or log why it waits"
    turn_limited = False
