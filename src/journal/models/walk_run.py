from dataclasses import dataclass

from journal.models.walk_record import WalkRecord


@dataclass(frozen=True)
class WalkRun:
    """A walk as the page lists it: its record, its event by title, and whether a node failed in it."""

    record: WalkRecord
    trigger: str
    failed: bool
