from enum import StrEnum


class PlanState(StrEnum):
    """Where a plan stands: drafted, made ready for approval, approved, followed, or finished."""

    DRAFT = "draft"
    READY = "ready"
    APPROVED = "approved"
    STARTED = "started"
    BLOCKED = "blocked"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

    @property
    def can_be_focused(self) -> bool:
        return self in (PlanState.STARTED, PlanState.APPROVED)
