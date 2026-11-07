from enum import StrEnum


class ApprovalState(StrEnum):
    OPEN = "open"
    RUNNING = "running"
    ACCEPTED = "accepted"
    REFUSED = "refused"
    CLOSED = "closed"
