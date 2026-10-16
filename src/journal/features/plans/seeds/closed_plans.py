from journal.features.seed import Seed
from journal.models.actor import Actor
from journal.models.plan_state import PlanState
from journal.repositories.plans import Plans


class ClosedPlans(Seed):
    """At boot, a started plan with no open task left is done: its tasks are the truth of it, whoever closed them."""

    def __init__(self, plans: Plans) -> None:
        self.plans = plans

    def run(self) -> None:
        for plan in self.plans.all():
            if plan.state == PlanState.STARTED and self.plans.next_task(plan) is None and self.plans.tasks_of(plan):
                self.plans.save(plan.done(), Actor.system())
