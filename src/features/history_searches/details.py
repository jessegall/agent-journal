from features.base import FeatureDetails
from features.groups import Group


class HistorySearchesDetails(FeatureDetails):
    explains = 'The chat marks when the agent searches past journal work. You can see what it looked for.'
    name = "history_searches"
    group = Group.CHAT
    label = "Show history searches"
    has_skill = False

    title = "History searches"

    abstract = "Whenever the agent searches the journal's history, the chat shows a mark saying what it looked for"

    help = """
        When the agent runs journal search, journal conversation or journal user, the chat shows a mark
        such as "Searched the history for tunler", "Read back the conversation the last summary replaced"
        or "Read back your own words", so you can see it looking before it answers.
    """
