from enum import StrEnum


class QuestionMarkVariant(StrEnum):
    """What a question mark says: the question is open and waits, or was closed unanswered; once it was answered, the
    card and the answer's own mark say who answered."""

    OPEN = "open"
    CLOSED = "closed"
    USER = "user"
    AGENT = "agent"
