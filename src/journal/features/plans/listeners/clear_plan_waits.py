from journal.support.typed_nudges import TypedNudges
from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.support.awaitables import Awaitables
from journal.support.actor import Actor
from journal.support.ref import Ref
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks


class ClearPlanWaits(Listener[Updated]):
    """A question answered, a task closed or a check waited until passing opens the plans blocked on it by a link, once nothing else holds them, and the live agent is told."""

    def __init__(self, plans: Plans, tasks: Tasks, typed: TypedNudges) -> None:
        self.plans, self.tasks, self.typed = plans, tasks, typed

    def handle(self, event: Updated) -> None:
        from journal.features.plans.feature import Plans as PlansFeature
        if not Awaitables.just_settled(event):
            return
        ref = Ref.to(event.model)
        for plan in self.plans.waiting_on(event.model):
            if self.tasks.open_waits(plan):
                continue
            self.plans.save(plan.unblocked(), Actor.system())
            self.typed.type(PlansFeature.PLAN_OPEN_AGAIN.create(n=plan.id, why=f"{ref.type[:-1]} {ref.id} came"))
