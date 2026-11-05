from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

HELPER_LIMIT_WARNING = NudgeDeclaration("helpers.limit_warning", NudgeType.STEERING, "agent:{agent} is near its {limit} limit: journal helper stop {agent}, or let it run out", turn_limited=False)
HELPER_NUDGES = [HELPER_LIMIT_WARNING]
