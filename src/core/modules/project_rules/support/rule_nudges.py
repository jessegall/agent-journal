from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

START_RULES = NudgeDeclaration("project_rules.start_rules", NudgeType.STEERING, "{count} project rules hold: read them with journal rule list --state active", turn_limited=False)
RULE_NUDGES = [START_RULES]
