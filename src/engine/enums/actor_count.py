from enum import StrEnum


class ActorCount(StrEnum):
    """How many actors one row of an assignable model can be given to at a time."""

    ONE = "one"
    MANY = "many"
