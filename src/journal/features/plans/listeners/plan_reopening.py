from datetime import datetime, timezone

from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.models.plan_state import PlanState
from journal.models.task import Task
from journal.repositories.links import Links
from journal.repositories.plans import PLAN_LINK, Plans


class PlanReopening(Listener[Updated]):
    """A closed task opened again starts its done plan again: a plan with open work is never shown done."""

    def __init__(self, plans: Plans, links: Links) -> None:
        self.plans, self.links = plans, links

    def handle(self, event: Updated) -> None:
        task, previous = event.model, event.previous_row(Task)
        if not isinstance(task, Task) or task.is_closed() or previous is None or not previous.is_closed():
            return
        for plan in [self.plans.find(ref.id) for ref in self.links.targets(task, PLAN_LINK)]:
            if plan.state == PlanState.FINISHED:
                self.plans.save(plan.reopened(datetime.now(timezone.utc).timestamp()), event.actor)
