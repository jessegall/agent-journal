from enum import StrEnum


class StackLevel(StrEnum):
    """The place of a frame on an agent's stack: the bottom, the work lane, the hold lane or the safety top."""

    BOTTOM = "bottom"
    WORK = "work"
    HOLD = "hold"
    SAFETY = "safety"
