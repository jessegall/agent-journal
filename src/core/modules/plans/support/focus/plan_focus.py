from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.enums.focus_source import FocusSource
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.focus.focus_overview import FocusOverview
from core.modules.plans.support.focus.focused_plan import FocusedPlan
from core.modules.plans.support.focus.plan_unblockers import PlanUnblockers
from core.modules.plans.support.focus.plan_work import PlanWork
from core.modules.plans.support.next_plan_tasks import NextPlanTasks


class PlanFocus:
    """Says which plan an agent works on first. With no plan named, it is the default: the oldest started plan
    that has work the agent can take now, a ready task of the plan or an open task the plan waits on. The
    default is worked out at each read and never stored; with no such plan the agent has no focus."""

    def __init__(self, queries: Queries, next_tasks: NextPlanTasks, unblockers: PlanUnblockers) -> None:
        self.queries, self.next_tasks, self.unblockers = queries, next_tasks, unblockers

    def current(self, agent: Agent) -> FocusedPlan | None:
        return self.overview(agent).current

    def overview(self, agent: Agent) -> FocusOverview:
        plans = tuple(self.queries.query(Plan).filter(state=PlanState.STARTED).ordered("started_at", "id").all_rows())
        unblockers = self.unblockers.of_plans([plan.id for plan in plans], agent)
        started = tuple(PlanWork(plan, self.next_tasks.ready(plan.id, agent), unblockers[plan.id]) for plan in plans)
        default = next((work.plan for work in started if work.is_workable), None)
        return FocusOverview(None if default is None else FocusedPlan(default, FocusSource.DEFAULT), started)
