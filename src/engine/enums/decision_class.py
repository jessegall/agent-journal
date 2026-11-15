from enum import IntEnum


class DecisionClass(IntEnum):
    """The class of a step's decision, the highest present winning: allow, hold, refuse or halt."""

    ALLOW = 0
    HOLD = 1
    REFUSE = 2
    HALT = 3
