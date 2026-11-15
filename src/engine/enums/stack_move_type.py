from enum import StrEnum


class StackMoveType(StrEnum):
    """One change of an agent's stack, as its history row names it."""

    SEEDED = "seeded"
    ENTERED = "entered"
    EXITED = "exited"
    DATA_CHANGED = "data-changed"
    PERSON_EXIT = "person-exit"
    REPINNED = "repinned"
    RESEEDED = "reseeded"
