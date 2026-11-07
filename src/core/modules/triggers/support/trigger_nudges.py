from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

TRIGGER_DENIES = NudgeDeclaration("triggers.trigger_denies", NudgeType.REFUSAL, 'trigger:{trigger} denies this: journal trigger show {trigger}')
TRIGGER_LINE = NudgeDeclaration("triggers.trigger_line", NudgeType.NOTICE, "trigger:{trigger} fired: journal trigger show {trigger}", turn_limited=False)

TRIGGER_NUDGES = [TRIGGER_DENIES, TRIGGER_LINE]
