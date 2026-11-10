from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

START_RULES = NudgeDeclaration("project_rules.start_rules", NudgeType.STEERING, "{count} project rules hold: read them", turn_limited=False)
RULE_NUDGES = [START_RULES]
