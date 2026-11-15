from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class BlockedWorkerTaskNudge(NudgeDeclaration):
    """The nudge workers.own_task_blocked."""

    key = "workers.own_task_blocked"
    type = NudgeType.STEERING
    text = 'task:{task} was blocked'
    turn_limited = False
