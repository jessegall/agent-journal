from collections.abc import Sequence

from engine.query.conditions.among import Among
from engine.query.select import Select
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.conditions.checkpoint_limit import CheckpointLimit
from core.modules.plans.conditions.earliest_unfinished_phase import EarliestUnfinishedPhase
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.queries.task_query import TaskQuery


class NextPlanTasks:
    """Selects the tasks of the earliest unfinished phase of each plan that one agent may take now, for all the
    plans in one read."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def ready(self, plan_ids: Sequence[int], agent: Agent) -> dict[int, tuple[PlanTask, ...]]:
        waiting = SubqueryMatch("task_id", Select(OpenDependency.view).column("task_id"), negated=True)
        takeable = SubqueryMatch("task_id", Select("tasks").matching(TaskQuery.takeable_condition(agent)).column("id"))
        places = self.queries.query(PlanTask).matching(Among("plan_id", plan_ids)).filter(state=TaskState.OPEN)
        rows = places.matching(waiting).matching(takeable).matching(EarliestUnfinishedPhase()).matching(CheckpointLimit()).all_rows()
        return {plan_id: tuple(place for place in rows if place.plan_id == plan_id) for plan_id in plan_ids}

    def plan_exclusion(self) -> SubqueryMatch:
        return SubqueryMatch("id", Select("phase_tasks").column("task_id"), negated=True)
