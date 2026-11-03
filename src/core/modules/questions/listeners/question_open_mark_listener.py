from core.modules.questions.listeners.question_mark_listener import QuestionMarkListener


class QuestionOpenMarkListener(QuestionMarkListener):
    """When a question is asked, the chat shows a process mark with it."""

    name = "questions.open-mark"
    event = "question.create"
