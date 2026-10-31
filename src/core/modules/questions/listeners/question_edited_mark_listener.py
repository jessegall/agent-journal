from core.modules.questions.listeners.question_mark_listener import QuestionMarkListener


class QuestionEditedMarkListener(QuestionMarkListener):
    """When an open question is edited, its process mark shows the new words in place."""

    name = "questions.edited-mark"
    event = "question.update"
