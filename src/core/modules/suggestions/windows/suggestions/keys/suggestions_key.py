from engine.viewer.window_key import WindowKey


class SuggestionsKey(WindowKey):
    """The suggestions data of the suggestions.suggestions window."""

    name = "suggestions"
    read = "suggestion list"
    events = ["suggestion.*"]
