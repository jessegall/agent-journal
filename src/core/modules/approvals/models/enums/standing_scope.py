from enum import StrEnum


class StandingScope(StrEnum):
    """How much a standing yes covers: the same request, or any request like it."""

    SAME = "same"
    LIKE = "like"
