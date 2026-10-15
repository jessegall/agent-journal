from dataclasses import dataclass

from journal.models.plan_state import PlanState
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Plan(Scoped):
    """Ordered work: its phases and tasks are linked to it. Built as draft, made ready by the agent, approved by the user, then followed: finishing one task starts the next."""

    title: str = ""
    brief: str = ""
    state: PlanState = PlanState.DRAFT

    def ready(self) -> "Plan":
        return self.with_(state=PlanState.READY)

    def approved(self) -> "Plan":
        return self.with_(state=PlanState.APPROVED)

    def started(self) -> "Plan":
        return self.with_(state=PlanState.STARTED)

    def parked(self) -> "Plan":
        return self.with_(state=PlanState.PARKED)

    def done(self) -> "Plan":
        return self.with_(state=PlanState.DONE)
