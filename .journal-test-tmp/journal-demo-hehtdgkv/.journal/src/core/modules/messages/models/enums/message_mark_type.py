from enum import StrEnum


class MessageMarkType(StrEnum):
    """The chat mark types the messages module adds."""

    SUMMARY = "messages.thought"
    FILED = "messages.filed"
    EDITED = "messages.edited"
