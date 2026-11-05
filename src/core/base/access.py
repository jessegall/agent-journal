from enum import StrEnum


class Access(StrEnum):
    """The file access an agent type allows."""

    READ_ONLY = "read-only"
    WRITING = "writing"
