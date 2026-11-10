from core.modules.questions.listeners.question_mark_listener import QuestionMarkListener
from engine.event.created import Created
from core.modules.questions.models.question import Question


class QuestionOpenMarkListener(QuestionMarkListener[Created[Question]]):
    """When a question is asked, the chat shows a process mark with it."""

    name = "questions.open-mark"
