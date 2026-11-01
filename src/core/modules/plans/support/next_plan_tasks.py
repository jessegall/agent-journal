from core.base.query.select import Select
from core.base.query.conditions.subquery_match import SubqueryMatch
from core.base.query.queries import Queries
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.listeners.support.checkpoint_limit import CheckpointLimit
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.open_dependency import OpenDependency


class NextPlanTasks:
    """Finds a plan's next open task that waits on nothing, never past a checkpoint phase that still has an open task."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def following(self, plan_id: int) -> int | None:
        waiting = SubqueryMatch("task_id", Select(OpenDependency.view).column("task_id"), negated=True)
        free_tasks = self.queries.query(PlanTask).filter(plan_id=plan_id, state=TaskState.OPEN).matching(waiting).matching(CheckpointLimit(plan_id))
        rows = free_tasks.ordered("phase_position", "position").page(1, 1).rows
        return rows[0].task_id if rows else None

    def in_environment(self, environment_id: int) -> int | None:
        for plan in tuple(self.queries.query(Plan).filter(environment_id=environment_id, state=PlanState.STARTED).oldest().all_rows()):
            following = self.following(plan.id)
            if following is not None:
                return following
        return None

    def outside_plans(self) -> SubqueryMatch:
        return SubqueryMatch("id", Select("phase_tasks").column("task_id"), negated=True)
