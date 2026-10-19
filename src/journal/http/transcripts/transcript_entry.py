from typing import TypedDict


class TranscriptEntry(TypedDict):
    """One turn of a transcript opened whole."""

    line: int
    text: str
    formatted: str
