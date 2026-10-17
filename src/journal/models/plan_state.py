from enum import StrEnum


class PlanState(StrEnum):
    DRAFT = "draft"
    READY = "ready"
    REVIEWING = "reviewing"
    APPROVED = "approved"
    STARTED = "started"
    PARKED = "parked"
    DONE = "done"
    CANCELLED = "cancelled"
