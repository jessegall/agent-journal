from core.base.driver.hook_history import HookHistory
from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge import Nudge
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.queries.plan_query import PlanQuery
from core.modules.plans.support.plan_nudges import PLAN_APPROVED, PLAN_BLOCKED, PLAN_CANCELLED


class PlanStateRule(DriverRule):
    """A plan of the environment approved, cancelled or blocked since this rule last spoke is named to the
    main agent."""

    name = "plans.state-lines"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    history = True

    def __init__(self, plans: PlanQuery, hook_history: HookHistory, queries: Queries) -> None:
        self.plans, self.hook_history, self.queries = plans, hook_history, queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        answered_at = self.hook_history.last_answer(self.name, hook)
        start = answered_at or self.queries.query(Agent).find(hook.agent_id).creation_timestamp()
        changed = self.plans.environment(hook.environment_id).matching(Greater("updated_at", start.text)).oldest().all_rows()
        return RuleAnswer.with_nudges(*(nudge for plan in changed for nudge in self.state_nudges(plan)))

    def state_nudges(self, plan: Plan) -> list[Nudge]:
        if plan.state is PlanState.APPROVED:
            return [PLAN_APPROVED.nudge(plan=plan.id)]
        if plan.state is PlanState.CANCELLED:
            return [PLAN_CANCELLED.nudge(plan=plan.id)]
        if plan.state is PlanState.BLOCKED:
            return [PLAN_BLOCKED.nudge(plan=plan.id)]
        return []
