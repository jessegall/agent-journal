from enum import StrEnum


class ReaderType(StrEnum):
    """How a reader picks what it shows of an output: lines that match a pattern, or a script of the project."""

    PATTERN = "pattern"
    SCRIPT = "script"
