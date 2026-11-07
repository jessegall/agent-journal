from enum import StrEnum


class WaitMarkVariant(StrEnum):
    """What a stuck mark says: the agent reported it is stuck."""

    REPORTED = "reported"
