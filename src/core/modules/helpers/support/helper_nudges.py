from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

HELPER_LIMIT_WARNING = NudgeDeclaration("helpers.limit_warning", NudgeType.STEERING, "agent:{agent} is near its {limit} limit: stop it, or let it run out", turn_limited=False)
HELPER_PROGRAM_FAULT = NudgeDeclaration("helpers.program_fault", NudgeType.STEERING, "agent:{agent} program exited with code {code}", turn_limited=False)
HELPER_SKILL_REFUSAL = NudgeDeclaration("helpers.skill_not_listed", NudgeType.REFUSAL, "{skill} is not one of the skills of your profile: read the skills it lists")
HELPER_NUDGES = [HELPER_LIMIT_WARNING, HELPER_PROGRAM_FAULT, HELPER_SKILL_REFUSAL]
