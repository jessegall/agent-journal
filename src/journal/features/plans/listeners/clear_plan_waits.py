from journal.engine.telling import Telling
from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.features.tasks.listeners.clear_waits import ClearWaits
from journal.models.actor import Actor
from journal.models.ref import Ref
from journal.repositories.plans import Plans
from journal.repositories.tasks import Tasks


class ClearPlanWaits(Listener[Updated]):
    """A question answered, a task closed or a check waited until passing opens the plans blocked on it by a link, once nothing else holds them, and the live agent is told."""

    def __init__(self, plans: Plans, tasks: Tasks, telling: Telling) -> None:
        self.plans, self.tasks, self.telling = plans, tasks, telling

    def handle(self, event: Updated) -> None:
        from journal.features.plans.feature import Plans as PlansFeature
        if not ClearWaits.ended(event):
            return
        ref = Ref.to(event.model)
        for plan in self.plans.waiting_on(event.model):
            if self.tasks.open_waits(plan):
                continue
            self.plans.save(plan.unblocked(), Actor.system())
            self.telling.tell(PlansFeature.OPEN_AGAIN.about(n=plan.id, why=f"{ref.type[:-1]} {ref.id} came"))
