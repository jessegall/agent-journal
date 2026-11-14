from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.rule_priority import RulePriority
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.queries.plan_query import PlanQuery
from core.modules.plans.conditions.plan_tasks_condition import PlanTasksCondition
from core.modules.tasks.queries.task_query import TaskQuery
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_places import WorkerPlaces
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_nudges import APPROVED_PLAN_WAIT
from suites.coding.modules.workers.support.worker_settings import DISPATCHES_WORKERS_SETTING

APPROVED_PLANS_REASON = "the approved plans whose tasks a stop checks for an agent"


class ApprovedPlanStopRule(DriverRule):
    """An approved plan waiting to start, with an open task no agent is given yet, holds the main agent while a
    worker place is free and the main agent may dispatch workers; a plan whose tasks a worker holds waits on it."""

    name = "workers.approved-plan-at-stop"
    hook = HookEventName.STOP
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]
    priority = RulePriority.STOP_PLAN_CHECK
    single_action_refusal = "An approved plan waiting to start holds the main agent while a worker place is free"

    def __init__(self, plans: PlanQuery, worktrees: WorktreeQuery, settings: SettingValues, places: WorkerPlaces, tasks: TaskQuery) -> None:
        self.places, self.tasks = places, tasks
        self.plans, self.worktrees, self.settings = plans, worktrees, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.settings.value(DISPATCHES_WORKERS_SETTING) is False:
            return RuleAnswer.allowed("the main agent dispatches no workers")
        if not self.places.can_start_new():
            return RuleAnswer.allowed("no new worker can start")
        plan_ids = tuple(plan.id for plan in self.plans.filter(state=PlanState.APPROVED).oldest().every_row(APPROVED_PLANS_REASON))
        plan = next((plan_id for plan_id in plan_ids if self.tasks.free().matching(PlanTasksCondition((plan_id,))).exists()), None)
        if plan is None:
            return RuleAnswer.allowed("no approved plan has a task no agent is given")
        return RuleAnswer.refused(APPROVED_PLAN_WAIT.nudge(plan=plan))
