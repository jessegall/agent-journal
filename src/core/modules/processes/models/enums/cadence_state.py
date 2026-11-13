from enum import StrEnum


class CadenceState(StrEnum):
    """How a run prints over time: often enough, nothing at all yet, nothing since it last printed, or too
    seldom for a reader to follow."""

    STREAMING = "streaming"
    SILENT = "no output"
    STOPPED_WRITING = "stopped writing"
    SPARSE = "sparse"

    @property
    def has_no_growth(self) -> bool:
        return self in (CadenceState.SILENT, CadenceState.STOPPED_WRITING)
