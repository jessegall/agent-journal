from enum import StrEnum


class ReadingPhase(StrEnum):
    """When the engine decided about a part of a run: as it started, while it ran, or when it ended."""

    START = "start"
    RUNNING = "running"
    END = "end"
