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

    def is_closed(self) -> bool:
        """Done or abandoned: nothing is left to do on it."""
        return self in (PlanState.DONE, PlanState.CANCELLED)

    def can_become(self, state: "PlanState") -> bool:
        """Only forward, or back to work: the user's approval is never undone by the agent, and a cancelled plan stays cancelled."""
        return state == self or state in MOVES[self]


MOVES = {
    PlanState.DRAFT: {PlanState.READY, PlanState.REVIEWING, PlanState.APPROVED, PlanState.PARKED, PlanState.DONE, PlanState.CANCELLED},
    PlanState.READY: {PlanState.DRAFT, PlanState.REVIEWING, PlanState.APPROVED, PlanState.PARKED, PlanState.DONE, PlanState.CANCELLED},
    PlanState.REVIEWING: {PlanState.READY, PlanState.PARKED, PlanState.DONE, PlanState.CANCELLED},
    PlanState.APPROVED: {PlanState.STARTED, PlanState.PARKED, PlanState.DONE, PlanState.CANCELLED},
    PlanState.STARTED: {PlanState.PARKED, PlanState.DONE, PlanState.CANCELLED},
    PlanState.PARKED: {PlanState.READY, PlanState.APPROVED, PlanState.STARTED, PlanState.DONE, PlanState.CANCELLED},
    PlanState.DONE: {PlanState.STARTED},
    PlanState.CANCELLED: set(),
}
"""The states each state may move to: any open plan may be finished or cancelled, and a done plan goes back to started when work is added to it."""
