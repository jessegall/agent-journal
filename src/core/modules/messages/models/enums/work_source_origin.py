from enum import StrEnum


class WorkSourceOrigin(StrEnum):
    """The action that selected or cleared a request."""

    READ = "read"
    REPLY = "reply"
    EXPLICIT = "work-from"
    CLEAR = "clear"
