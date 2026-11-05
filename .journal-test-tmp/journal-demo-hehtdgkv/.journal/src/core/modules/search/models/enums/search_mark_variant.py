from enum import StrEnum


class SearchMarkVariant(StrEnum):
    """What a search mark says: the agent searched and these rows held the words."""

    MATCHED = "found"
