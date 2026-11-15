from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType


class QuestionToolNudge(NudgeDeclaration):
    """The nudge questions.own_question_tool."""

    key = "questions.own_question_tool"
    type = NudgeType.REFUSAL
    text = "Ask through the question command with a title, context and options, not your own question tool"
