from enum import StrEnum


class ItemState(StrEnum):
    """Where an item of a dump stands: not read yet, noted by the agent, filed as rows, or failed."""

    NEW = "new"
    READ = "noted"
    FILED = "filed"
    FAILED = "failed"
