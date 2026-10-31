from enum import StrEnum


class MessageMarkVariant(StrEnum):
    """What a message mark says: the agent said something, or a message of the user was filed."""

    SUMMARY = "summary"
    FILED = "filed"
