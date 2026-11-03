from core.base.viewer.window_searcher import ModelSearcher
from core.modules.suggestions.models.suggestion import Suggestion


class SuggestionSearcher(ModelSearcher):
    """Finds the suggestions whose title holds the words."""

    model = Suggestion
