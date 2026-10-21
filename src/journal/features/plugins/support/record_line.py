from datetime import datetime
from typing import TypedDict


class RecordLine(TypedDict):
    """One thing a plugin did, as its record on the Plugins page lists it: when, what kind, in words, and the row it opens, as tasks:12, or none."""

    time: datetime
    kind: str
    text: str
    ref: str
