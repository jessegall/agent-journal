from enum import StrEnum


class CopyProgress(StrEnum):
    """Where a copy stands for a person: in step, a change on its way, paused for a run, or the reason it is not in
    step. The reasons use the names of the stored states."""

    SYNCED = "synced"
    SENDING = "sending"
    UNSENT = "unsent"
    PAUSED = "paused"
    DENIED = "denied"
    REJECTED = "rejected"
    CONFLICT = "conflict"
    REVIEW = "review"
    REMOVED = "removed"
    AGENT = "agent"

    @property
    def label(self) -> str:
        return LABELS[self]


LABELS = {
    CopyProgress.SYNCED: "In sync",
    CopyProgress.SENDING: "Sending",
    CopyProgress.UNSENT: "Waiting to send",
    CopyProgress.PAUSED: "Waiting for its run to end",
    CopyProgress.DENIED: "Local change, not sent",
    CopyProgress.REJECTED: "Not accepted by the server",
    CopyProgress.CONFLICT: "Conflict",
    CopyProgress.REVIEW: "New version to read",
    CopyProgress.REMOVED: "Removed from the library",
    CopyProgress.AGENT: "Agent change, not sent",
}
