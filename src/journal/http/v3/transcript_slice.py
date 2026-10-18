from typing import TypedDict

from journal.http.v3.transcript_heading import TranscriptHeading


class TranscriptSlice(TypedDict):
    """A page of a transcript: how many turns it holds, the first one's line, and the turns shown."""

    total: int
    first: int
    turns: list[TranscriptHeading]
