from enum import StrEnum


class MessageMarkType(StrEnum):
    """The chat mark types the messages module adds."""

    THOUGHT = "messages.thought"
    FILED = "messages.filed"
