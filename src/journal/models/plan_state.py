from enum import StrEnum


class PlanState(StrEnum):
    DRAFT = "draft"
    READY = "ready"
    REVIEWING = "reviewing"
    APPROVED = "approved"
    STARTED = "started"
    SUSPENDED = "parked"
    BLOCKED = "blocked"
    FINISHED = "done"
    CANCELLED = "cancelled"

    def is_closed(self) -> bool:
        return self in (PlanState.FINISHED, PlanState.CANCELLED)

    def is_unapproved(self) -> bool:
        return self in (PlanState.DRAFT, PlanState.READY, PlanState.REVIEWING)

    def is_startable(self) -> bool:
        return self in (PlanState.APPROVED, PlanState.SUSPENDED, PlanState.STARTED)

    def can_become(self, state: "PlanState") -> bool:
        return state == self or state in MOVES[self]


MOVES = {
    PlanState.DRAFT: {PlanState.READY, PlanState.REVIEWING, PlanState.APPROVED, PlanState.FINISHED, PlanState.CANCELLED},
    PlanState.READY: {PlanState.DRAFT, PlanState.REVIEWING, PlanState.APPROVED, PlanState.FINISHED, PlanState.CANCELLED},
    PlanState.REVIEWING: {PlanState.READY, PlanState.FINISHED, PlanState.CANCELLED},
    PlanState.APPROVED: {PlanState.STARTED, PlanState.SUSPENDED, PlanState.FINISHED, PlanState.CANCELLED},
    PlanState.STARTED: {PlanState.SUSPENDED, PlanState.BLOCKED, PlanState.FINISHED, PlanState.CANCELLED},
    PlanState.BLOCKED: {PlanState.STARTED, PlanState.SUSPENDED, PlanState.FINISHED, PlanState.CANCELLED},
    PlanState.SUSPENDED: {PlanState.READY, PlanState.APPROVED, PlanState.STARTED, PlanState.FINISHED, PlanState.CANCELLED},
    PlanState.FINISHED: {PlanState.STARTED},
    PlanState.CANCELLED: set(),
}
