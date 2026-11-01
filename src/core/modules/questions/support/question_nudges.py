from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

QUESTION_CHANGED = NudgeDeclaration("questions.question_changed", NudgeType.INSTRUCTION, '{text}')
OWN_QUESTION_TOOL = NudgeDeclaration("questions.own_question_tool", NudgeType.REFUSAL, 'ask with journal question ask "<one line>" --options "a" "b", not your own question tool')

QUESTION_NUDGES = [QUESTION_CHANGED, OWN_QUESTION_TOOL]
