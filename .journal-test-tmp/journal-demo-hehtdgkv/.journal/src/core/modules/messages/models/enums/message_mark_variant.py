from enum import StrEnum


class MessageMarkVariant(StrEnum):
    """What a message mark says: the agent said something, a message of the user was filed, or an agent edited
    a message."""

    SUMMARY = "summary"
    FILED = "filed"
    EDITED = "edited"
