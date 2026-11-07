from core.base.query.conditions.among import Among
from core.base.query.conditions.has_value import HasValue
from core.base.query.select import Select
from core.base.query.conditions.subquery_match import SubqueryMatch
from core.base.query.queries import Queries
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.conditions.checkpoint_limit import CheckpointLimit
from core.modules.tasks.models.enums.task_state import UNFINISHED_STATES, TaskState
from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.models.task import Task


class NextPlanTasks:
    """Selects the next non-delegated task in the earliest unfinished plan phase."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def following(self, plan_id: int) -> int | None:
        waiting = SubqueryMatch("task_id", Select(OpenDependency.view).column("task_id"), negated=True)
        unfinished = self.queries.query(PlanTask).filter(plan_id=plan_id).matching(Among("state", UNFINISHED_STATES)).matching(waiting).ordered("phase_position").first()
        if unfinished is None:
            return None
        free = SubqueryMatch("task_id", Select("tasks").matching(HasValue("delegated_to")).column("id"), negated=True)
        free_tasks = self.queries.query(PlanTask).filter(plan_id=plan_id, phase_position=unfinished.phase_position, state=TaskState.OPEN).matching(waiting).matching(free).matching(CheckpointLimit(plan_id)).all_rows()
        first = min(free_tasks, key=lambda place: (-place.priority, place.task_id), default=None)
        return first.task_id if first is not None else None

    def environment_task(self) -> Task | None:
        plans = self.queries.query(Plan).filter(state=PlanState.STARTED).ordered("started_at", "id").all_rows()
        following = next((task_id for task_id in map(self.following, (plan.id for plan in plans)) if task_id is not None), None)
        return None if following is None else self.queries.query(Task).find(following)

    def plan_exclusion(self) -> SubqueryMatch:
        return SubqueryMatch("id", Select("phase_tasks").column("task_id"), negated=True)
