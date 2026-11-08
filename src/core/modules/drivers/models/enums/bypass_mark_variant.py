from enum import StrEnum


class BypassMarkVariant(StrEnum):
    """What a bypass mark tells of."""

    UNCHECKED = "unchecked"
    PANIC_STARTED = "panic-started"
    PANIC_ENDED = "panic-ended"
    TIMEOUTS = "timeouts"
