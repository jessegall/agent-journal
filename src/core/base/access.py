from enum import StrEnum


class Access(StrEnum):
    """The file access an agent type allows."""

    READING = "read-only"
    WRITING = "writing"
