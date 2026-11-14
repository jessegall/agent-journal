from enum import StrEnum


class MergeAskState(StrEnum):
    """Where a worker's ask for a merge stands: waiting for the merger, merged, or sent back by the merge."""

    WAITING = "waiting"
    MERGED = "merged"
    RETURNED = "returned"
