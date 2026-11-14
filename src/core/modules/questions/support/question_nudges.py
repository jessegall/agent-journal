from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

QUESTION_ANSWERED = NudgeDeclaration("questions.question_answered", NudgeType.NOTICE,
                                   "question:{question} is answered",
                                   plural_text="questions {question} are answered", id_field="question")
QUESTION_ANSWER_SOURCE = NudgeDeclaration("questions.answer_source", NudgeType.NOTICE,
                                        "question:{question} was answered by message:{message}",
                                        plural_text="answer sources: {reference}")
QUESTION_CLOSED = NudgeDeclaration("questions.question_closed", NudgeType.NOTICE, "The user closed question:{question} without answering",
                                  plural_text="the user closed questions {question} unanswered", id_field="question")
QUESTION_TOOL = NudgeDeclaration("questions.own_question_tool", NudgeType.REFUSAL, "Ask through the question command with a title, context and options, not your own question tool")

QUESTION_NUDGES = [QUESTION_ANSWERED, QUESTION_ANSWER_SOURCE, QUESTION_CLOSED, QUESTION_TOOL]
