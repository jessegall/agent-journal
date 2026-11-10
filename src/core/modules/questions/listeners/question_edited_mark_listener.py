from core.modules.questions.listeners.question_mark_listener import QuestionMarkListener
from engine.change.updated import Updated
from core.modules.questions.models.question import Question


class QuestionEditedMarkListener(QuestionMarkListener[Updated[Question]]):
    """When an open question is edited, its process mark shows the new words in place."""

    name = "questions.edited-mark"
