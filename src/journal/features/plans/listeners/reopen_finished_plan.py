from datetime import datetime, timezone

from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.models.link import Link
from journal.models.plan_state import PlanState
from journal.repositories.plans import IN_PLAN, Plans


class ReopenFinishedPlan(Listener[Created]):
    """A task put into a plan that is done, while the task is still to do, starts the plan again: a plan with open work is never shown done."""

    def __init__(self, plans: Plans) -> None:
        self.plans = plans

    def handle(self, event: Created) -> None:
        link = event.model
        if not isinstance(link, Link) or link.kind != IN_PLAN:
            return
        plan = self.plans.find(link.target.id)
        if plan.state == PlanState.DONE and not self.plans.finished(plan):
            self.plans.save(plan.started_with_nothing_to_start(datetime.now(timezone.utc).timestamp()), event.by)
