from features.base import FeatureDetails
from features.groups import Group


class ThinkingDetails(FeatureDetails):
    explains = "The chat can show the agent's working thoughts while it is busy. You can hide them from the chat."
    name = "thinking"
    group = Group.CHAT
    label = "Show what the agent is thinking"
    has_skill = False

    title = "Thinking"

    abstract = "While the agent works, the chat shows what it is thinking in place of the working dots"

    help = """
        Your latest thinking, read from your session's transcript, stands in the chat's
        working bubble while you work, and each new thought replaces the last. A visible message
        or the next turn clears it. Thinking never becomes a message in the chat.
    """
