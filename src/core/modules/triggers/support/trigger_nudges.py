from core.base.driver.nudge_declaration import NudgeDeclaration, WHOLE_LINE_CHARACTERS
from core.base.driver.nudge_type import NudgeType

TRIGGER_DENIES = NudgeDeclaration("triggers.trigger_denies", NudgeType.REFUSAL, 'a trigger denies this: {text}')
TRIGGER_LINE = NudgeDeclaration("triggers.trigger_line", NudgeType.INSTRUCTION, '{text}', longest_characters=WHOLE_LINE_CHARACTERS, turn_limited=False)

TRIGGER_NUDGES = [TRIGGER_DENIES, TRIGGER_LINE]
