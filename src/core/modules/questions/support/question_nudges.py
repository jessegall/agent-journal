from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType

QUESTION_ANSWERED = NudgeDeclaration("questions.question_answered", NudgeType.NOTICE,
                                   "question:{question} is answered; journal question show {question}",
                                   plural_text="questions {question} are answered; inspect each with journal question show <question>", id_field="question")
QUESTION_ANSWER_SOURCE = NudgeDeclaration("questions.answer_source", NudgeType.NOTICE,
                                        "question:{question} answer source message:{message}; select it with journal message work-from {message}",
                                        plural_text="answer sources: {reference}; select one with journal message work-from <message>")
QUESTION_CLOSED = NudgeDeclaration("questions.question_closed", NudgeType.NOTICE, "the user closed question:{question} unanswered",
                                  plural_text="the user closed questions {question} unanswered", id_field="question")
QUESTION_TOOL = NudgeDeclaration("questions.own_question_tool", NudgeType.REFUSAL, 'ask with journal question ask "<title>" --context "<sentences>" --options "a" "b", not your own question tool')

QUESTION_NUDGES = [QUESTION_ANSWERED, QUESTION_ANSWER_SOURCE, QUESTION_CLOSED, QUESTION_TOOL]
