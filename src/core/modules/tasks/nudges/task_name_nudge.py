from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class TaskNameNudge(NudgeDeclaration):
    """The nudge tasks.named_task."""

    key = "tasks.named_task"
    type = NudgeType.STEERING
    text = "Task {task} names open task {other}: if it waits on it, block it on that task"
    turn_limited = False
