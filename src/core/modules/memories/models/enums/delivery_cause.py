from enum import StrEnum


class DeliveryCause(StrEnum):
    """Why a memory was given to an agent."""

    START = "start"
    MARK = "mark"
    KEYWORD = "keyword"
    DUE = "due"
    READ = "read"
