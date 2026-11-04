from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

TRIGGER_DENIES = NudgeDeclaration("triggers.trigger_denies", NudgeType.REFUSAL, 'a trigger denies this: {text}')
TRIGGER_LINE = NudgeDeclaration("triggers.trigger_line", NudgeType.NOTICE, '{text}', turn_limited=False)

TRIGGER_NUDGES = [TRIGGER_DENIES, TRIGGER_LINE]
