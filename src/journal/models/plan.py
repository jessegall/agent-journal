from dataclasses import dataclass
from typing import ClassVar

from journal.models.plan_state import PlanState
from journal.models.scoped import Scoped
from journal.support.refused import Refused


@dataclass(frozen=True)
class Plan(Scoped):
    """Ordered work: its phases and tasks are linked to it. Built as draft, made ready by the agent, held in review while reviewers read it, counting those still out, approved by the user, then followed: finishing one task starts the next."""

    text_fields: ClassVar[tuple[str, ...]] = ("title", "brief")

    title: str = ""
    brief: str = ""
    state: PlanState = PlanState.DRAFT
    blocked_why: str = ""
    reviewers: int = 0

    def ready(self) -> "Plan":
        return self.moved(PlanState.READY)

    def reviewing(self) -> "Plan":
        return self.moved(PlanState.REVIEWING)

    def approved(self) -> "Plan":
        return self.moved(PlanState.APPROVED)

    def started(self) -> "Plan":
        return self.moved(PlanState.STARTED)

    def parked(self) -> "Plan":
        return self.moved(PlanState.PARKED)

    def blocked(self, why: str) -> "Plan":
        return self.moved(PlanState.BLOCKED).with_(blocked_why=why)

    def unblocked(self) -> "Plan":
        return self.moved(PlanState.STARTED).with_(blocked_why="")

    def is_blocked(self) -> bool:
        return self.state == PlanState.BLOCKED

    def done(self) -> "Plan":
        return self.moved(PlanState.DONE)

    def cancelled(self) -> "Plan":
        return self.moved(PlanState.CANCELLED)

    def moved(self, state: PlanState) -> "Plan":
        if not self.state.can_become(state):
            raise Refused(f"plan {self.id} is {self.state} and cannot become {state}")
        return self.with_(state=state)

