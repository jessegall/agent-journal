from enum import IntEnum


class PressureLevel(IntEnum):
    """How hard the engine presses an agent, from a line it may pass over to a hold on every tool."""

    SUGGEST = 1
    PREVENT = 2
    BLOCK = 3
    HOLD = 4
