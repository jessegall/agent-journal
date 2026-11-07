from enum import StrEnum


class WorktreeState(StrEnum):
    """Where a worker's worktree stands, from its row being made to its folder being removed."""

    NEW = "new"
    CUT = "cut"
    DELIVERED = "delivered"
    MERGED = "merged"
    REMOVED = "removed"
    FAILED = "failed"
    ABANDONED = "abandoned"
