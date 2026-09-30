from features.base import FeatureDetails


class HistorySearchesDetails(FeatureDetails):
    name = "history_searches"
    has_skill = False

    title = "History searches in the chat"

    abstract = "Whenever the agent searches the journal's history, the chat shows a mark saying what it looked for"

    help = """
        When the agent runs journal search, journal conversation or journal user, the chat shows a mark
        such as "Searched the history for tunler", "Read back the conversation the last summary replaced"
        or "Read back your own words", so you can see it looking before it answers.
    """
