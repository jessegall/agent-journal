from enum import StrEnum


class MarkGrouping(StrEnum):
    """What marks fold together by when three or more stand together: their family, their type, the row
    they name, the run they belong to, or never."""

    FAMILY = "family"
    TYPE = "type"
    ROW = "row"
    RUN = "run"
    NEVER = "never"
