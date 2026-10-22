from dataclasses import dataclass


@dataclass(frozen=True)
class UploadAnswer:
    """How many rows the first full copy brought, and the sequence the team's log stands at after it."""

    rows: int
    head: int
