from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerTaskBlockedNudge(NudgeDeclaration):
    """The nudge workers.task_blocked."""

    key = "workers.task_blocked"
    type = NudgeType.STEERING
    text = "worker:{worker} blocked task:{task}: only you or a user can unblock it"
    turn_limited = False
    wakes_agent = True
