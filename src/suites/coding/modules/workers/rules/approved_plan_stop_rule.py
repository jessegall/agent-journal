from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.queries.plan_query import PlanQuery
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_places import WorkerPlaces
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_nudges import APPROVED_PLAN_WAIT
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_LIMIT


class ApprovedPlanStopRule(DriverRule):
    """An approved plan waiting to start holds the main agent while a worker place is free."""

    name = "workers.approved-plan-at-stop"
    hook = HookEventName.STOP
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]
    priority = -10

    def __init__(self, plans: PlanQuery, worktrees: WorktreeQuery, settings: SettingValues, places: WorkerPlaces) -> None:
        self.places = places
        self.plans, self.worktrees, self.settings = plans, worktrees, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not self.places.can_start_new():
            return RuleAnswer.allowed("no new worker can start")
        plan = self.plans.filter(state=PlanState.APPROVED).oldest().first()
        if plan is None:
            return RuleAnswer.allowed("no approved plan waits to start")
        return RuleAnswer.refused(APPROVED_PLAN_WAIT.nudge(plan=plan.id))
