from dataclasses import dataclass

from journal.models.plan_state import PlanState
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Plan(Scoped):
    """Ordered work: its tasks are linked to it, and following it means finishing one and starting the next."""

    title: str = ""
    brief: str = ""
    state: PlanState = PlanState.DRAFT

    def started(self) -> "Plan":
        return self.with_(state=PlanState.STARTED)

    def parked(self) -> "Plan":
        return self.with_(state=PlanState.PARKED)

    def done(self) -> "Plan":
        return self.with_(state=PlanState.DONE)
