from features.base import FeatureDetails


class ThinkingDetails(FeatureDetails):
    name = "thinking"

    title = "Thinking"

    abstract = "While the agent works, the chat shows what it is thinking in place of the working dots"

    help = """
        The agent's latest thinking, read from its session's transcript, stands in the chat's
        working bubble while it works, and each new thought replaces the last. A visible message
        clears it. A thought that no visible message answered before the next turn starts is
        kept in the chat, marked as thinking, so nothing the agent meant to say is lost.
    """
