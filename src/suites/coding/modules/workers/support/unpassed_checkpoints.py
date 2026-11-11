from collections.abc import Sequence

from core.modules.plans.conditions.plan_tasks_condition import PlanTasksCondition
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.task_plans import TaskPlans
from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries


class UnpassedCheckpoints:
    """Finds the tasks that come after a checkpoint phase of their plan that has not passed: a checkpoint phase
    with a task that is not closed, or whose tests have not passed. Such a task is not started until it has.
    Each waiting task is given by its id with a place of the first such checkpoint phase of its plan."""

    def __init__(self, plans: TaskPlans, queries: Queries, kept: KeptRows) -> None:
        self.plans, self.queries, self.kept = plans, queries, kept

    def blocking_places(self, task_ids: Sequence[int]) -> dict[int, PlanTask]:
        self.plans.prepare(task_ids)
        places = {task_id: self.blocking_place(task_id) for task_id in task_ids}
        return {task_id: place for task_id, place in places.items() if place is not None}

    def blocking_place(self, task_id: int) -> PlanTask | None:
        phase = self.plans.find_phase(task_id)
        if phase is None:
            return None
        checkpoint = self.first_unpassed(phase.plan_id)
        if checkpoint is None or phase.position <= checkpoint.phase_position:
            return None
        return checkpoint

    def first_unpassed(self, plan_id: int) -> PlanTask | None:
        condition = PlanTasksCondition(tuple([plan_id])).statement()
        places = self.kept.read("tasks", lambda: tuple(self.queries.query(PlanTask).filter(plan_id=plan_id, checkpoint=True).all_rows()), condition.sql, condition.parameters,
                                name="workers.checkpoint_places")
        return min((place for place in places if place.is_untested_checkpoint), key=lambda place: place.phase_position, default=None)
