from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class QuestionClosedNudge(NudgeDeclaration):
    """The nudge questions.question_closed."""

    key = "questions.question_closed"
    type = NudgeType.NOTICE
    text = "The user closed question:{question} without answering"
    plural_text = "the user closed questions {question} unanswered"
    id_field = "question"
