from typing import TypedDict


class TranscriptHeading(TypedDict):
    """One turn of a transcript as its page lists it: where it is, who wrote it, when, the tools it used, and its text when it is spoken."""

    line: int
    who: str
    kind: str
    time: float
    tools: list[str]
    text: str
    has_text: bool
