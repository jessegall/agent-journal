from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

HELPER_LIMIT_WARNING = NudgeDeclaration("helpers.limit_warning", NudgeType.STEERING, "agent:{agent} is near its {limit} limit: stop it, or let it run out", turn_limited=False)
HELPER_PROGRAM_FAULT = NudgeDeclaration("helpers.program_fault", NudgeType.STEERING, "agent:{agent} program exited with code {code}: check its output", turn_limited=False)
HELPER_GRANTED = NudgeDeclaration("helpers.granted", NudgeType.STEERING, "helper-grant:{grant} lists what you may run with your helper run command", turn_limited=False, wakes_agent=True, id_field="grant", plural_text="helper-grants {grant} say what you may run")
LOCKDOWN_ENDED = NudgeDeclaration("helpers.lockdown_ended", NudgeType.STEERING, "The usage limit ended: continue what you were doing", turn_limited=False, wakes_agent=True)
START_WITHOUT_MODEL = NudgeDeclaration("helpers.start_without_model", NudgeType.REFUSAL, "Name a model when starting a helper or worker, or default for the profile's own")
HELPER_NUDGES = [START_WITHOUT_MODEL, LOCKDOWN_ENDED, HELPER_GRANTED, HELPER_LIMIT_WARNING, HELPER_PROGRAM_FAULT]
