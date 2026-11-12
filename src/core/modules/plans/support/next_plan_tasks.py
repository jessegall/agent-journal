from engine.query.conditions.among import Among
from engine.query.select import Select
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.condition import Condition
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.conditions.checkpoint_limit import CheckpointLimit
from core.modules.tasks.models.enums.task_state import UNFINISHED_STATES, TaskState
from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.queries.task_query import TaskQuery

NEXT_TASKS_REASON = "the next tasks of a plan are every takeable task of its current phase"


class NextPlanTasks:
    """Selects the tasks of the earliest unfinished phase of a plan that one agent may take now."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def ready(self, plan_id: int, agent: Agent) -> tuple[PlanTask, ...]:
        return self.ready_places(plan_id, SubqueryMatch("task_id", Select("tasks").matching(TaskQuery.takeable_condition(agent)).column("id")))

    def ready_places(self, plan_id: int, takeable: Condition) -> tuple[PlanTask, ...]:
        waiting = SubqueryMatch("task_id", Select(OpenDependency.view).column("task_id"), negated=True)
        unfinished = self.queries.query(PlanTask).filter(plan_id=plan_id).matching(Among("state", UNFINISHED_STATES)).matching(waiting).ordered("phase_position").first()
        if unfinished is None:
            return ()
        places = self.queries.query(PlanTask).filter(plan_id=plan_id, phase_position=unfinished.phase_position, state=TaskState.OPEN)
        return tuple(places.matching(waiting).matching(takeable).matching(CheckpointLimit(plan_id)).every_row(NEXT_TASKS_REASON))

    def plan_exclusion(self) -> SubqueryMatch:
        return SubqueryMatch("id", Select("phase_tasks").column("task_id"), negated=True)
