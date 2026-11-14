from enum import StrEnum


class KeyLoading(StrEnum):
    """When a window reads a key by itself: with its first read, right after it, or only when asked for it."""

    FIRST = "first"
    AFTER_WINDOW = "after_window"
    REQUESTED = "requested"
