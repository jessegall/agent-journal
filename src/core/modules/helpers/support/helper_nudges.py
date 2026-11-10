from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

HELPER_LIMIT_WARNING = NudgeDeclaration("helpers.limit_warning", NudgeType.STEERING, "agent:{agent} is near its {limit} limit: stop it, or let it run out", turn_limited=False)
HELPER_PROGRAM_FAULT = NudgeDeclaration("helpers.program_fault", NudgeType.STEERING, "agent:{agent} program exited with code {code}", turn_limited=False)
HELPER_SKILL_REFUSAL = NudgeDeclaration("helpers.skill_not_listed", NudgeType.REFUSAL, "that skill is not one of the skills of your profile: read the skills it lists")
HELPER_GRANTED = NudgeDeclaration("helpers.granted", NudgeType.STEERING, "helper-grant:{grant} says what you may run with your helper run command", turn_limited=False, wakes_agent=True, id_field="grant", plural_text="helper-grants {grant} say what you may run")
LOCKDOWN_ENDED = NudgeDeclaration("helpers.lockdown_ended", NudgeType.STEERING, "The usage limit ended; go on with what you were doing.", turn_limited=False, wakes_agent=True)
HELPER_NUDGES = [LOCKDOWN_ENDED, HELPER_GRANTED, HELPER_LIMIT_WARNING, HELPER_PROGRAM_FAULT, HELPER_SKILL_REFUSAL]
