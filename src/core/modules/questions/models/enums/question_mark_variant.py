from enum import StrEnum


class QuestionMarkVariant(StrEnum):
    """What a question mark says: the question is open and waits, was answered, or was closed unanswered; an answer's
    own mark says who answered."""

    OPEN = "open"
    ANSWERED = "answered"
    CLOSED = "closed"
    USER = "user"
    AGENT = "agent"
