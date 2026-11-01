from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge import Nudge
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.greater import Greater
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.queries.plan_query import PlanQuery
from core.modules.plans.support.plan_nudges import PLAN_APPROVED, PLAN_BLOCKED, PLAN_CANCELLED


class PlanStateRule(DriverRule):
    """A plan of the environment approved, cancelled or blocked since the main agent's last hook is named to it."""

    name = "plans.state-lines"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, plans: PlanQuery, hook_calls: HookCallQuery) -> None:
        self.plans, self.hook_calls = plans, hook_calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        last_call = self.hook_calls.newest_agent_hook(hook.agent_id)
        if last_call is None:
            return RuleAnswer.allowed()
        changed = self.plans.environment(hook.environment_id).matching(Greater("updated_at", last_call.created_at.text)).oldest().all_rows()
        return RuleAnswer.with_nudges(*(nudge for plan in changed for nudge in self.state_nudges(plan)))

    def state_nudges(self, plan: Plan) -> list[Nudge]:
        if plan.state is PlanState.APPROVED:
            return [PLAN_APPROVED.nudge(plan=plan.id)]
        if plan.state is PlanState.CANCELLED:
            return [PLAN_CANCELLED.nudge(plan=plan.id, reason=plan.reason)]
        if plan.state is PlanState.BLOCKED:
            return [PLAN_BLOCKED.nudge(plan=plan.id, reason=plan.reason)]
        return []
