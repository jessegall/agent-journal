from journal.support.telling import Telling
from journal.events.listener import Listener
from journal.events.models.updated import Updated
from journal.support.actor import Actor
from journal.models.plan_state import PlanState
from journal.models.task import Task
from journal.repositories.plans import Plans


class BlockPlanOnItsTasks(Listener[Updated]):
    """A started plan whose every task left is blocked blocks itself, since none of its work can go on, and opens again the moment one of them opens; a single blocked task never blocks its plan. The agent is told either way."""

    def __init__(self, plans: Plans, telling: Telling) -> None:
        self.plans, self.telling = plans, telling

    def handle(self, event: Updated) -> None:
        from journal.features.plans.feature import Plans as PlansFeature
        task = event.model
        if not isinstance(task, Task) or event.was is None or task.state == event.was.state:
            return
        for plan in self.plans.holding(task):
            if plan.state == PlanState.STARTED and self.plans.all_left_blocked(plan):
                self.plans.save(plan.blocked(PlansFeature.ALL_BLOCKED), Actor.system())
                self.telling.tell(PlansFeature.BLOCKED.about(n=plan.id, why=PlansFeature.ALL_BLOCKED))
            elif plan.is_blocked() and plan.blocked_why == PlansFeature.ALL_BLOCKED and not self.plans.all_left_blocked(plan):
                self.plans.save(plan.unblocked(), Actor.system())
                self.telling.tell(PlansFeature.OPEN_AGAIN.about(n=plan.id, why=f"task {task.id} is open again"))
