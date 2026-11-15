from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class RuleTaskNudge(NudgeDeclaration):
    """The nudge assign_rules.task_given."""

    key = "assign_rules.task_given"
    type = NudgeType.NOTICE
    text = "task:{task} is yours by assign-rule:{rule}"
    turn_limited = False
