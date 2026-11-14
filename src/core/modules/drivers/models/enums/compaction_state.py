from enum import StrEnum


class CompactionState(StrEnum):
    """Where a compaction stands: its line was requested, the program started it, the program ended it, the
    first context size read after its end was recorded, that size was no smaller, it failed, or its line never
    started and the journal gave it up."""

    REQUESTED = "requested"
    STARTED = "started"
    ENDED = "ended"
    MEASURED = "measured"
    UNREDUCED = "unreduced"
    FAILED = "failed"
    ABANDONED = "abandoned"

    @property
    def is_open(self) -> bool:
        return self in (CompactionState.REQUESTED, CompactionState.STARTED)
