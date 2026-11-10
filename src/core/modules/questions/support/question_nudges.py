from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.nudge_type import NudgeType

QUESTION_ANSWERED = NudgeDeclaration("questions.question_answered", NudgeType.NOTICE,
                                   "question:{question} is answered", wakes_agent=True,
                                   plural_text="questions {question} are answered", id_field="question")
QUESTION_ANSWER_SOURCE = NudgeDeclaration("questions.answer_source", NudgeType.NOTICE,
                                        "question:{question} answer source message:{message}",
                                        plural_text="answer sources: {reference}")
QUESTION_CLOSED = NudgeDeclaration("questions.question_closed", NudgeType.NOTICE, "the user closed question:{question} unanswered",
                                  plural_text="the user closed questions {question} unanswered", id_field="question")
QUESTION_TOOL = NudgeDeclaration("questions.own_question_tool", NudgeType.REFUSAL, 'ask through the question command with a title, a context and options, not your own question tool')

QUESTION_NUDGES = [QUESTION_ANSWERED, QUESTION_ANSWER_SOURCE, QUESTION_CLOSED, QUESTION_TOOL]
