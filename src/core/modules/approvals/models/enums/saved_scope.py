from enum import StrEnum


class SavedScope(StrEnum):
    """How much a saved yes covers: the same request, or any request like it."""

    EXACT = "same"
    LIKE = "like"
