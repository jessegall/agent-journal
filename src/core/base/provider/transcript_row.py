from dataclasses import dataclass


@dataclass(frozen=True)
class TranscriptRow:
    """One row of a session's transcript: who wrote it, its type, and its text."""

    author: str
    row_type: str
    text: str
