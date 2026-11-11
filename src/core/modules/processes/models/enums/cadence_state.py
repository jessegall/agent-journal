from enum import StrEnum


class CadenceState(StrEnum):
    """How a run prints over time; a run that prints as it goes is streaming."""

    STREAMING = "streaming"
