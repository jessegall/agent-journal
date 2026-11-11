from enum import StrEnum


class ReaderState(StrEnum):
    """How well a command's output is read: no reader needed, a reader that fits, a poor one, a draft that would
    fit, none at all, or an output no reader can read."""

    NOT_NEEDED = "not needed"
    SUITABLE = "suitable"
    POOR = "poor"
    DRAFTABLE = "draftable"
    MISSING = "missing"
    UNREADABLE = "unreadable"
