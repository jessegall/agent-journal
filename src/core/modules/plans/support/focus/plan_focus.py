from engine.command.context import Context
from engine.database.database import Database
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.row.metadata import Metadata
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.enums.focus_source import FocusSource
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.focus.focus_overview import FocusOverview
from core.modules.plans.support.focus.focused_plan import FocusedPlan
from core.modules.plans.support.focus.plan_unblockers import PlanUnblockers
from core.modules.plans.support.focus.plan_work import PlanWork
from core.modules.plans.support.focus.unused_focus import UnusedFocus
from core.modules.plans.support.next_plan_tasks import NextPlanTasks

PLANS_MODULE = "journal.core.plans"
FOCUS_KEY = "focus_plan"
DELETED_STATE = "gone"


class PlanFocus:
    """Says which plan an agent works on first, and keeps the plan an agent named on the agent's own row. With
    no plan named, the focus is the default: the oldest started plan that has work the agent can take now, a
    ready task of the plan or an open task the plan waits on. The default is worked out at each read and never
    stored; one read is kept until the database changes. A named plan that is not started or approved is not
    used, and stays kept."""

    def __init__(self, queries: Queries, repository: Repository, next_tasks: NextPlanTasks, unblockers: PlanUnblockers, database: Database) -> None:
        self.queries, self.repository, self.next_tasks, self.unblockers, self.database = queries, repository, next_tasks, unblockers, database
        self.overview_read_mark: object = None
        self.last_overview = FocusOverview(None, ())

    def choose(self, agent: Agent, plan: Plan, context: Context) -> Agent:
        return self.keep(agent, {**agent.metadata.module_part(PLANS_MODULE), FOCUS_KEY: plan.id}, context)

    def clear(self, agent: Agent, context: Context) -> Agent:
        return self.keep(agent, {key: value for key, value in agent.metadata.module_part(PLANS_MODULE).items() if key != FOCUS_KEY}, context)

    def keep(self, agent: Agent, part: dict[str, object], context: Context) -> Agent:
        return self.repository.save_metadata(agent, Metadata({**agent.metadata.values, PLANS_MODULE: part}), context)

    @staticmethod
    def explicit_plan_id(agent: Agent) -> int | None:
        explicit_id = agent.metadata.module_part(PLANS_MODULE).get(FOCUS_KEY)
        return explicit_id if isinstance(explicit_id, int) else None

    def current(self, agent: Agent) -> FocusedPlan | None:
        return self.overview(agent).current

    def overview(self, agent: Agent) -> FocusOverview:
        read_mark = (self.database.change_mark(), self.database.row_owner, agent.id, self.explicit_plan_id(agent))
        if read_mark != self.overview_read_mark:
            self.overview_read_mark, self.last_overview = read_mark, self.loaded_overview(agent)
        return self.last_overview

    def loaded_overview(self, agent: Agent) -> FocusOverview:
        plans = tuple(self.queries.query(Plan).filter(state=PlanState.STARTED).ordered("started_at", "id").all_rows())
        explicit_id = self.explicit_plan_id(agent)
        explicit_plan = next((plan for plan in plans if plan.id == explicit_id), None)
        unused = None
        if explicit_id is not None and explicit_plan is None:
            stored = self.queries.query(Plan).filter(id=explicit_id).first()
            if stored is not None and stored.state is PlanState.APPROVED:
                explicit_plan, plans = stored, (*plans, stored)
            else:
                unused = UnusedFocus(explicit_id, DELETED_STATE if stored is None else stored.state.value)
        unblockers = self.unblockers.plan_unblockers([plan.id for plan in plans], agent)
        started = tuple(PlanWork(plan, self.next_tasks.ready(plan.id, agent), unblockers[plan.id]) for plan in plans)
        if explicit_plan is not None:
            return FocusOverview(FocusedPlan(explicit_plan, FocusSource.EXPLICIT), started)
        default = next((work.plan for work in started if work.is_workable), None)
        return FocusOverview(None if default is None else FocusedPlan(default, FocusSource.DEFAULT), started, unused)
