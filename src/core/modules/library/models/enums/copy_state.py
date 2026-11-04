from enum import StrEnum


class CopyState(StrEnum):
    """Why a local copy is or is not in step with its item on the shared server."""

    SYNCED = "synced"
    DENIED = "denied"
    REJECTED = "rejected"
    CONFLICT = "conflict"
    REVIEW = "review"
    REMOVED = "removed"
