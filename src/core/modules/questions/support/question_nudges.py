from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

QUESTION_ANSWERED = NudgeDeclaration("questions.question_answered", NudgeType.INSTRUCTION, "question:{question} is answered")
QUESTION_CLOSED = NudgeDeclaration("questions.question_closed", NudgeType.INSTRUCTION, "the user closed question:{question} unanswered")
QUESTION_TOOL = NudgeDeclaration("questions.own_question_tool", NudgeType.REFUSAL, 'ask with journal question ask "<one line>" --options "a" "b", not your own question tool')

QUESTION_NUDGES = [QUESTION_ANSWERED, QUESTION_CLOSED, QUESTION_TOOL]
