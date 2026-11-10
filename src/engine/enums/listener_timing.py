from enum import StrEnum


class ListenerTiming(StrEnum):
    """When a listener runs: before a deletion is written, after a save is written, or after the commit."""

    DELETION = "deletion"
    SAVE = "save"
    COMMIT = "commit"
