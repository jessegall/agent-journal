from enum import StrEnum


class Access(StrEnum):
    """The file access an agent type allows."""

    READ = "read-only"
    WRITING = "writing"
