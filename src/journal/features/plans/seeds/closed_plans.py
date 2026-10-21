from datetime import datetime, timezone
from journal.models.plan import Plan
from journal.features.environment_seed import EnvironmentSeed
from journal.support.actor import Actor
from journal.models.plan_state import PlanState
from journal.repositories.environments import Environments
from journal.repositories.plans import Plans
from journal.repositories.scope import Scope


class ClosedPlans(EnvironmentSeed):
    """At boot, a started plan with no open task left is done: its tasks are the truth of it, whoever closed them."""

    def __init__(self, plans: Plans, environments: Environments, scope: Scope) -> None:
        super().__init__(environments, scope)
        self.plans = plans

    def run_scoped(self) -> None:
        for plan in self.plans.all():
            if self.is_complete(plan):
                self.plans.save(plan.finished(datetime.now(timezone.utc).timestamp()), Actor.system())

    def is_complete(self, plan: Plan) -> bool:
        return plan.state == PlanState.STARTED and self.plans.next_task(plan) is None and bool(self.plans.plan_tasks(plan))
