from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.focus.plan_focus import PlanFocus
from core.modules.tasks.models.task_block_review import TaskBlockReview
from core.modules.tasks.support.block_review_scope import BlockReviewScope

FOCUSED_TASKS_REASON = "the focus keeps every listed task that is a task of the plan"


class FocusedBlockReviewScope(BlockReviewScope):
    """Narrows the blocked tasks an agent goes over to the plan it named as its focus, while that plan is started
    or approved."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def covered(self, agent_id: int, tasks: tuple[TaskBlockReview, ...]) -> tuple[TaskBlockReview, ...]:
        plan_id = PlanFocus.explicit_plan_id(self.queries.query(Agent).find(agent_id))
        plan = None if plan_id is None else self.queries.query(Plan).filter(id=plan_id).first()
        if plan is None or not plan.state.can_be_focused:
            return tasks
        task_ids = {row.task_id for row in self.queries.query(PlanTask).filter(plan_id=plan.id).matching(Among("task_id", [task.task_id for task in tasks])).every_row(FOCUSED_TASKS_REASON)}
        return tuple(task for task in tasks if task.task_id in task_ids)
