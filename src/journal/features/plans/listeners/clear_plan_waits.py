from datetime import datetime, timezone
from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.support.wait_targets import WaitTargets
from journal.support.actor import Actor
from journal.support.ref import Ref
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks


class ClearPlanWaits(Listener[Updated]):
    """A question answered, a task closed or a check waited until passing opens the plans blocked on it by a link, once nothing else holds them, and the live agent is told."""

    def __init__(self, plans: Plans, tasks: Tasks) -> None:
        self.plans, self.tasks = plans, tasks

    def handle(self, event: Updated) -> None:
        if not WaitTargets.is_newly_resolved(event):
            return
        ref = Ref.build(event.model)
        for plan in self.plans.waiting_plans(event.model):
            if self.tasks.open_waits(plan):
                continue
            self.plans.save(plan.unblocked(f"{ref.type[:-1]} {ref.id} came", datetime.now(timezone.utc).timestamp()), Actor.system())
