from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class StopTasksNudge(NudgeDeclaration):
    """The nudge tasks.tasks_at_stop."""

    key = "tasks.tasks_at_stop"
    type = NudgeType.REFUSAL
    text = "In hand: {tasks}: continue, or close, release or block each one"
