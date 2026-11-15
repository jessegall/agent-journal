from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnfocusedTaskNudge(NudgeDeclaration):
    """The nudge plans.unfocused_task."""

    key = "plans.unfocused_task"
    type = NudgeType.NOTICE
    text = "Task {task} belongs to plan {plan}; your focus is plan {focus}"
    turn_limited = False
