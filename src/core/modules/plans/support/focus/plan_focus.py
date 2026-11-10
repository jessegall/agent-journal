from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.enums.focus_source import FocusSource
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.focus.focused_plan import FocusedPlan
from core.modules.plans.support.focus.plan_unblockers import PlanUnblockers
from core.modules.plans.support.next_plan_tasks import NextPlanTasks


class PlanFocus:
    """Says which plan an agent works on first. With no plan named, it is the default: the oldest started plan
    that has work the agent can take now, a ready task of the plan or an open task the plan waits on. The
    default is worked out at each read and never stored; with no such plan the agent has no focus."""

    def __init__(self, queries: Queries, next_tasks: NextPlanTasks, unblockers: PlanUnblockers) -> None:
        self.queries, self.next_tasks, self.unblockers = queries, next_tasks, unblockers

    def current(self, agent: Agent) -> FocusedPlan | None:
        default = next((plan for plan in self.started_plans() if self.is_workable(plan.id, agent)), None)
        return None if default is None else FocusedPlan(default, FocusSource.DEFAULT)

    def started_plans(self) -> tuple[Plan, ...]:
        return tuple(self.queries.query(Plan).filter(state=PlanState.STARTED).ordered("started_at", "id").all_rows())

    def is_workable(self, plan_id: int, agent: Agent) -> bool:
        return bool(self.next_tasks.ready(plan_id, agent)) or bool(self.unblockers.unblockers(plan_id, agent).candidates)
