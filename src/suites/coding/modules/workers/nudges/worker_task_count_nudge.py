from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class WorkerTaskCountNudge(NudgeDeclaration):
    """The nudge workers.started_task_count."""

    key = "workers.started_task_count"
    type = NudgeType.STEERING
    text = "You hold {count} of the {limit} tasks you may hold at once"
    turn_limited = False
