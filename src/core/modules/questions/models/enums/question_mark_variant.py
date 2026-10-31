from enum import StrEnum


class QuestionMarkVariant(StrEnum):
    """What a question mark says: the question is open and waits, was answered, or was closed unanswered."""

    OPEN = "open"
    ANSWERED = "answered"
    CLOSED = "closed"
