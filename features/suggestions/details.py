from features.base import FeatureDetails


class SuggestionsDetails(FeatureDetails):
    name = "suggestions"

    title = "Suggestions"

    speaks_while_waiting = True

    abstract = "An accepted or adjusted suggestion becomes a to-do that cites it; a decline files nothing"

    help = """
        The to-do carries the suggestion's title and brief, or the user's own words when
        adjusted, and auto mode works it like any other.
    """
