from enum import StrEnum


class QuestionState(StrEnum):
    """Where a question stands."""

    OPEN = "open"
    ANSWERED = "answered"
    CLOSED = "closed"
