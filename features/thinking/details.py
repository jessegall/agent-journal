from features.base import FeatureDetails


class ThinkingDetails(FeatureDetails):
    name = "thinking"

    title = "Thinking"

    abstract = "While the agent works, the chat shows what it is thinking in place of the working dots"

    help = """
        The agent's latest thinking, read from its session's transcript, stands in the chat's
        working bubble while it works, and each new thought replaces the last. A visible message
        or the next turn clears it. Thinking never becomes a message in the chat.
    """
