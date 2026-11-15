from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class UnlinkedTasksNudge(NudgeDeclaration):
    """The nudge plans.unlinked_tasks."""

    key = "plans.unlinked_tasks"
    type = NudgeType.STEERING
    text = "plan {plan}: {count} open tasks, none blocked: set what each one waits on"
    turn_limited = False
