from features.base import FeatureDetails


class ThinkingDetails(FeatureDetails):
    name = "thinking"
    has_skill = False

    title = "Thinking"

    abstract = "While the agent works, the chat shows what it is thinking in place of the working dots"

    help = """
        Your latest thinking, read from your session's transcript, stands in the chat's
        working bubble while you work, and each new thought replaces the last. A visible message
        or the next turn clears it. Thinking never becomes a message in the chat.
    """
