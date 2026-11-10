from enum import StrEnum


class HaltStyle(StrEnum):
    """How a program is stopped at a hook event: stopped outright, its tool denied and the program stopped in one
    answer, or only refused, for an event at which the program cannot be stopped."""

    STOP = "stop"
    DENY = "deny"
    REFUSE = "refuse"
