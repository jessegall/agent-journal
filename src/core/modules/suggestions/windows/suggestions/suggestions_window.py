from engine.viewer.window import Window
from core.modules.suggestions.support.skeletons import SUGGESTIONS_SUGGESTIONS_SKELETON
from core.modules.suggestions.support.suggestion_searcher import SuggestionSearcher
from engine.enums.window_icon import WindowIcon
from engine.enums.window_loading import WindowLoading
from engine.viewer.window_search import WindowSearch
from core.modules.suggestions.windows.suggestions.keys.suggestions_key import SuggestionsKey


class SuggestionsWindow(Window):
    """The Suggestions window."""

    name = "suggestions.suggestions"
    title = "Suggestions"
    entry = "suggestions.js"
    loading = WindowLoading.COMPONENT
    skeleton = SUGGESTIONS_SUGGESTIONS_SKELETON
    search = WindowSearch(SuggestionSearcher, "Search the suggestions")
    icon = WindowIcon.BULB
    reads = ["suggestion list"]
    events = ["suggestion.*"]
    keys = [SuggestionsKey]
