from enum import StrEnum


class CadenceState(StrEnum):
    """How a run prints over time: often enough, nothing at all yet, nothing since it last printed, or too
    seldom for a reader to follow."""

    STREAMING = "streaming"
    NO_OUTPUT = "no output"
    STOPPED_WRITING = "stopped writing"
    SPARSE = "sparse"
