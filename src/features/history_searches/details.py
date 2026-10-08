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
        naming the tool and what it looked for, such as "Conversation search 'tunler'",
        "Message search 'assign'", "Conversation history before the last compaction" or
        "Message history your messages", so you can see it looking before it answers.
    """
