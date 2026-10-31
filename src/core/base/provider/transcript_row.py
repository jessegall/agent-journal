from dataclasses import dataclass


@dataclass(frozen=True)
class TranscriptRow:
    """One row of a session's transcript: its place in the session, who wrote it, its type, and its text."""

    id: int
    author: str
    row_type: str
    text: str
