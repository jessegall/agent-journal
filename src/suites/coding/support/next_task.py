from core.base.query.queries import Queries
from core.modules.plans.support.next_plan_tasks import NextPlanTasks
from core.modules.plans.support.plan_task_order import PlanTaskOrder
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.tasks.models.support.task_priority import URGENT_PRIORITY
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.support.coding_settings import AUTO_MODE_SETTING
from suites.coding.support.context_over_limit import ContextOverLimit


class NextTask:
    """The coding suite's task assigner: an agent with empty hands is given a task above high outside any
    plan, else a task reserved for it, else a started plan's next task, else the most urgent open task
    outside any plan that waits on nothing. An agent with tasks still in hand is given only the task above
    high. Auto mode turns it on, and an agent past its context limit is given nothing until its stop has
    compacted it."""

    def __init__(self, tasks: TaskQuery, plan_tasks: NextPlanTasks, queries: Queries, settings: SettingValues, over_limit: ContextOverLimit, plan_order: PlanTaskOrder) -> None:
        self.tasks, self.plan_tasks, self.queries, self.settings, self.over_limit = tasks, plan_tasks, queries, settings, over_limit
        self.plan_order = plan_order

    def is_automatic(self) -> bool:
        return self.settings.flag(AUTO_MODE_SETTING)

    def holds_back_from(self, agent_id: int) -> bool:
        return self.over_limit.tokens(agent_id) is not None

    def may_stop_holding_tasks(self, agent_id: int) -> bool:
        return self.over_limit.compacts_at_stop(agent_id)

    def urgent(self, excluded_id: int | None = None) -> Task | None:
        most_urgent = self.tasks.next_open(excluded_id, self.plan_tasks.plan_exclusion())
        return most_urgent if most_urgent is not None and most_urgent.priority >= URGENT_PRIORITY else None

    def reserved(self, agent_id: int) -> Task | None:
        return self.plan_order.first_in_started_plans(self.tasks.ready_delegated(agent_id))

    def following(self, agent_id: int, excluded_id: int | None = None) -> Task | None:
        open_task = self.tasks.next_open(excluded_id, self.plan_tasks.plan_exclusion())
        if open_task is not None and open_task.priority >= URGENT_PRIORITY:
            return open_task
        reserved = self.reserved(agent_id)
        if reserved is not None:
            return reserved
        planned = self.plan_tasks.environment_task()
        if planned is not None and planned.id != excluded_id:
            return planned
        return open_task
