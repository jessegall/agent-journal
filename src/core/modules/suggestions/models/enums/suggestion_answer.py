from enum import StrEnum


class SuggestionAnswer(StrEnum):
    """How the person answered a suggestion."""

    ACCEPTED = "accepted"
    DECLINED = "declined"
