from enum import StrEnum


class ChatMarkState(StrEnum):
    """Whether a mark still follows a process that runs, or ended and is never edited again."""

    SHOWN = "shown"
    ENDED = "ended"
