from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

RULE_GIVEN_SOURCE = "assign-rules.task-given"

TASK_GIVEN_BY_RULE = NudgeDeclaration("assign_rules.task_given", NudgeType.NOTICE, "task:{task} is yours by rule {rule}", turn_limited=False)
ASSIGN_RULES_NUDGES = [TASK_GIVEN_BY_RULE]
