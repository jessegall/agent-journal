from enum import StrEnum


class PlanState(StrEnum):
    DRAFT = "draft"
    READY = "ready"
    REVIEWING = "reviewing"
    APPROVED = "approved"
    STARTED = "started"
    PARKED = "parked"
    BLOCKED = "blocked"
    DONE = "done"
    CANCELLED = "cancelled"

    def is_closed(self) -> bool:
        return self in (PlanState.DONE, PlanState.CANCELLED)

    def can_be_started(self) -> bool:
        return self in (PlanState.APPROVED, PlanState.PARKED, PlanState.STARTED)

    def can_become(self, state: "PlanState") -> bool:
        return state == self or state in MOVES[self]


MOVES = {
    PlanState.DRAFT: {PlanState.READY, PlanState.REVIEWING, PlanState.APPROVED, PlanState.DONE, PlanState.CANCELLED},
    PlanState.READY: {PlanState.DRAFT, PlanState.REVIEWING, PlanState.APPROVED, PlanState.DONE, PlanState.CANCELLED},
    PlanState.REVIEWING: {PlanState.READY, PlanState.DONE, PlanState.CANCELLED},
    PlanState.APPROVED: {PlanState.STARTED, PlanState.PARKED, PlanState.DONE, PlanState.CANCELLED},
    PlanState.STARTED: {PlanState.PARKED, PlanState.BLOCKED, PlanState.DONE, PlanState.CANCELLED},
    PlanState.BLOCKED: {PlanState.STARTED, PlanState.PARKED, PlanState.DONE, PlanState.CANCELLED},
    PlanState.PARKED: {PlanState.READY, PlanState.APPROVED, PlanState.STARTED, PlanState.DONE, PlanState.CANCELLED},
    PlanState.DONE: {PlanState.STARTED},
    PlanState.CANCELLED: set(),
}
