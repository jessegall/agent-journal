from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

TRIGGER_DENIES = NudgeDeclaration("triggers.trigger_denies", NudgeType.REFUSAL, 'trigger:{trigger} denies this')
TRIGGER_LINE = NudgeDeclaration("triggers.trigger_line", NudgeType.NOTICE, "trigger:{trigger} fired", turn_limited=False, plural_text="triggers {trigger} fired", id_field="trigger")

TRIGGER_NUDGES = [TRIGGER_DENIES, TRIGGER_LINE]
