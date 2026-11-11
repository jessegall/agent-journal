from enum import StrEnum


class UnreadableReason(StrEnum):
    """Why no reader can read an output."""

    EMPTY = "empty"
    BINARY = "binary"
    SINGLE_LINE = "single line"
    INTERACTIVE = "interactive"
    DECLARED = "declared"
