from enum import StrEnum


class PlanDockType(StrEnum):
    """The dock types the plans module adds."""

    STARTED = "plans.started"
    WAITING = "plans.waiting"
    PAUSED = "plans.paused"
    COMPLETED = "plans.completed"
    CANCELLED = "plans.cancelled"
