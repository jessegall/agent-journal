from journal.models.plan import Plan
from journal.models.task import Task
from journal.repositories.plans import Plans


class TaskDelivery:
    """How a work mode hands out the tasks of the started plans: which plan goes first after a task closed in one, and the tasks on offer in the order they go out, those of the plans first and then the loose ones."""

    def __init__(self, plans: Plans) -> None:
        self.plans = plans

    def ordered_plans(self, started: list[Plan], closed_plan_id: int) -> list[Plan]:
        raise NotImplementedError

    def planned_offers(self, started: list[Plan]) -> list[Task]:
        raise NotImplementedError

    def offers(self) -> list[Task]:
        return [*self.planned_offers(self.plans.offering_plans()), *self.plans.free()]
