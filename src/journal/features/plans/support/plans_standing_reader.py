from journal.features.plans.support.plans_standing import PlansStanding
from journal.models.agent import Agent
from journal.models.plan_state import PlanState
from journal.repositories.plans import Plans


class PlansStandingReader:
    """Reads the plans feature's part of the Standing for an agent."""

    def __init__(self, plans: Plans) -> None:
        self.plans = plans

    def read(self, agent: Agent) -> PlansStanding:
        started = next((p for p in self.plans.in_() if p.state == PlanState.STARTED), None)
        task = (self.plans.resumable(started) or self.plans.next_task(started)) if started else None
        return PlansStanding(approved=tuple(p.id for p in self.plans.approved()), started=started.id if started else 0, next_task=task.id if task else 0)
