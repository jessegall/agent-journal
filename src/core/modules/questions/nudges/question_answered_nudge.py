from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class QuestionAnsweredNudge(NudgeDeclaration):
    """The nudge questions.question_answered."""

    key = "questions.question_answered"
    type = NudgeType.NOTICE
    text = "question:{question} is answered"
    plural_text = "questions {question} are answered"
    id_field = "question"
