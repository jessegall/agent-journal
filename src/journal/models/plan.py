from dataclasses import dataclass

from journal.models.plan_state import PlanState
from journal.models.scoped import Scoped
from journal.refused import Refused


@dataclass(frozen=True)
class Plan(Scoped):
    """Ordered work: its phases and tasks are linked to it. Built as draft, made ready by the agent, held in review while reviewers read it, approved by the user, then followed: finishing one task starts the next."""

    title: str = ""
    brief: str = ""
    state: PlanState = PlanState.DRAFT

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

    def done(self) -> "Plan":
        return self.moved(PlanState.DONE)

    def cancelled(self) -> "Plan":
        return self.moved(PlanState.CANCELLED)

    def moved(self, state: PlanState) -> "Plan":
        if not self.state.can_become(state):
            raise Refused(f"plan {self.id} is {self.state} and cannot become {state}")
        return self.with_(state=state)
