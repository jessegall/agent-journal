from enum import StrEnum


class QuestionMarkVariant(StrEnum):
    """What a question mark says: the question is asked and waits, was answered, or was closed unanswered."""

    ASKED = "asked"
    ANSWERED = "answered"
    CLOSED = "closed"
