from enum import StrEnum


class WaitMarkVariant(StrEnum):
    """What an impasse mark says: the agent reported it is stuck."""

    STUCK = "stuck"
