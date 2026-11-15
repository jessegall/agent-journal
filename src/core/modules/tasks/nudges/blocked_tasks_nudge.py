from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class BlockedTasksNudge(NudgeDeclaration):
    """The nudge tasks.blocked_tasks."""

    key = "tasks.blocked_tasks"
    type = NudgeType.REFUSAL
    text = "Blocked tasks: {tasks}: unblock what can continue, or stop again to leave them"
