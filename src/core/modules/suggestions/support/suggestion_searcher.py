from core.base.viewer.model_searcher import ModelSearcher
from core.modules.suggestions.models.suggestion import Suggestion


class SuggestionSearcher(ModelSearcher):
    """Finds the suggestions whose title holds the words."""

    model = Suggestion
