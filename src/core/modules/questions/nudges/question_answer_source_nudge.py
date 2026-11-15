from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class QuestionAnswerSourceNudge(NudgeDeclaration):
    """The nudge questions.answer_source."""

    key = "questions.answer_source"
    type = NudgeType.NOTICE
    text = "question:{question} was answered by message:{message}"
    plural_text = "answer sources: {reference}"
