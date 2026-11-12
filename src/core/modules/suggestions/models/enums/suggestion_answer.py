from enum import StrEnum


class SuggestionAnswer(StrEnum):
    """How the user answered a suggestion."""

    ACCEPTED = "accepted"
    DECLINED = "declined"
