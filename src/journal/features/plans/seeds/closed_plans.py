from journal.features.environment_seed import EnvironmentSeed
from journal.support.actor import Actor
from journal.models.plan_state import PlanState
from journal.repositories.environments import Environments
from journal.repositories.plans import Plans
from journal.support.scope import Scope


class ClosedPlans(EnvironmentSeed):
    """At boot, a started plan with no open task left is done: its tasks are the truth of it, whoever closed them."""

    def __init__(self, plans: Plans, environments: Environments, scope: Scope) -> None:
        super().__init__(environments, scope)
        self.plans = plans

    def run_in(self) -> None:
        for plan in self.plans.all():
            if plan.state == PlanState.STARTED and self.plans.next_task(plan) is None and self.plans.tasks_of(plan):
                self.plans.save(plan.done(), Actor.system())
