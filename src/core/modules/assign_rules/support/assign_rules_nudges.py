from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

RULE_NUDGE_SOURCE = "assign-rules.task-given"

RULE_TASK_NUDGE = NudgeDeclaration("assign_rules.task_given", NudgeType.NOTICE, "task:{task} is yours by rule {rule}", turn_limited=False)
ASSIGN_RULES_NUDGES = [RULE_TASK_NUDGE]
