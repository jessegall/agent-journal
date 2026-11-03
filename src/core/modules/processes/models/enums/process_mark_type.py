from enum import StrEnum


class ProcessMarkType(StrEnum):
    """The chat mark types the processes module adds."""

    COMMAND = "processes.command"
    READER_REQUEST = "processes.reader_request"
