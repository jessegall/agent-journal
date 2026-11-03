from dataclasses import dataclass


@dataclass(frozen=True)
class TranscriptRow:
    """One row of a session's transcript: its place in the session, who wrote it, its type, its text and the time the
    session file gives it."""

    id: int
    author: str
    row_type: str
    text: str
    time: str = ""
