from enum import StrEnum


class CopyState(StrEnum):
    """Why a local copy is or is not in step with its item on the shared server."""

    SYNCED = "synced"
    DENIED = "denied"
    REJECTED = "rejected"
    CONFLICT = "conflict"
    REVIEW = "review"
    REMOVED = "removed"
    AGENT = "agent"

    @property
    def needs_choice(self) -> bool:
        return self in (CopyState.DENIED, CopyState.REJECTED, CopyState.CONFLICT, CopyState.REVIEW, CopyState.AGENT)
