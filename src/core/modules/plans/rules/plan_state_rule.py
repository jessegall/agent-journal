from core.base.driver.hook_history import HookHistory
from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge import Nudge
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.queries.plan_query import PlanQuery
from core.modules.plans.support.plan_nudges import PLAN_APPROVED, PLAN_APPROVED_WITH_MESSAGE, PLAN_BLOCKED, PLAN_CANCELLED, PLAN_WAITING
from core.modules.plans.support.plan_approval import PlanApproval

STATE_NUDGES: dict[PlanState, NudgeDeclaration] = {
    PlanState.READY: PLAN_WAITING,
    PlanState.APPROVED: PLAN_APPROVED,
    PlanState.CANCELLED: PLAN_CANCELLED,
    PlanState.BLOCKED: PLAN_BLOCKED,
}


class PlanStateRule(DriverRule):
    """A plan of the environment ready, approved, cancelled or blocked since this rule last spoke is named to the
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
        changed = self.plans.matching(Greater("updated_at", start.text)).matching(Among("state", tuple(STATE_NUDGES))).oldest().all_rows()
        return RuleAnswer.with_nudges(*(self.plan_nudge(plan) for plan in changed))

    def plan_nudge(self, plan: Plan) -> Nudge:
        if plan.state is not PlanState.APPROVED:
            return STATE_NUDGES[plan.state].nudge(plan=plan.id)
        message_id = PlanApproval.message_id(plan)
        if message_id is None:
            return PLAN_APPROVED.nudge(plan=plan.id)
        return PLAN_APPROVED_WITH_MESSAGE.nudge(plan=plan.id, message=message_id)
