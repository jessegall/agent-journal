from typing import TypedDict


class RecordLine(TypedDict):
    """One thing a plugin did, as its record on the Plugins page lists it: when, what kind, in words, and the row it opens."""

    at: float
    kind: str
    text: str
    ref: str
