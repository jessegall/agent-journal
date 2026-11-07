from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.block_until import BlockUntil
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.queries.plan_query import PlanQuery
from core.modules.plans.support.block_conditions.plan_context_read import PlanContextRead
from core.modules.plans.support.plan_context_delivery import PlanContextDelivery
from core.modules.plans.support.plan_nudges import PLAN_CONTEXT


class PlanContextRule(DriverRule):
    """A main agent reads each started plan's context before changing project files."""

    name = "plans.start-context"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, plans: PlanQuery, delivery: PlanContextDelivery) -> None:
        self.plans, self.delivery = plans, delivery

    def answer(self, hook: AgentHook) -> RuleAnswer:
        for plan in self.plans.filter(state=PlanState.STARTED).oldest().all_rows():
            event_id = self.delivery.start_event(plan)
            if event_id is not None and not self.delivery.has_read(plan.id, event_id, hook.agent_id):
                nudge = PLAN_CONTEXT.nudge(plan=plan.id)
                condition = PlanContextRead(plan.id)
                tool = hook.event.tool
                if tool is not None and not tool.block_exempt:
                    return RuleAnswer.blocked(hook, nudge, condition)
                return RuleAnswer.with_nudges(nudge).running(BlockUntil(hook.agent_id, nudge, condition))
        return RuleAnswer.allowed()
