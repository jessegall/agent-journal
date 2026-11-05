from core.base.viewer.model_searcher import ModelSearcher
from core.modules.questions.models.question import Question


class QuestionSearcher(ModelSearcher):
    """Finds the questions whose text or answer holds the words."""

    model = Question
