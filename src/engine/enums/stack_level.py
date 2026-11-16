from enum import StrEnum


class StackLevel(StrEnum):
    """The place of a stacked state on an agent's stack: the bottom, the work lane, the hold lane or the safety top."""

    BOTTOM = "bottom"
    WORK = "work"
    BLOCK = "hold"
    SAFETY = "safety"
