from enum import StrEnum


class UpdateResult(StrEnum):
    """How a worker's update of its worktree ended: moved onto the base, already on it, or left with merge markers."""

    UPDATED = "updated"
    CURRENT = "current"
    CONFLICTS = "conflicts"
