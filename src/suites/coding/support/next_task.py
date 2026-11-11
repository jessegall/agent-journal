from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.plans.support.focus.focused_plan_tasks import FocusedPlanTasks
from core.modules.plans.support.next_plan_tasks import NextPlanTasks
from core.modules.plans.support.plan_task_order import PlanTaskOrder
from engine.setting.setting_values import SettingValues
from core.modules.tasks.models.support.task_priority import URGENT_PRIORITY
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.support.next_task_choices import NextTaskChoices
from suites.coding.support.coding_settings import AUTO_MODE_SETTING
from suites.coding.support.context_limit_check import ContextLimitCheck


class NextTask:
    """The coding suite's task assigner: an agent with empty hands is given the task it was told to take next,
    else a task above high outside any plan, else the next task of its plan focus (a ready task of that plan
    or an open task the plan waits on), else the next task of the oldest started plan, else the most urgent
    open task outside any plan that waits on nothing, else, last, a task reserved for it, which stays open
    and is never one the agent released just now. A task reserved for the agent that is work of its focus
    is given at the focus step. An agent with tasks still in hand
    is given only the task above high. Auto mode turns it on, and an agent past its context limit is given
    nothing until its stop has compacted it."""

    def __init__(self, tasks: TaskQuery, plan_tasks: NextPlanTasks, queries: Queries, settings: SettingValues, context_limit: ContextLimitCheck, plan_order: PlanTaskOrder, choices: NextTaskChoices, focused: FocusedPlanTasks) -> None:
        self.tasks, self.plan_tasks, self.queries, self.settings, self.context_limit = tasks, plan_tasks, queries, settings, context_limit
        self.plan_order, self.choices, self.focused = plan_order, choices, focused

    def is_automatic(self) -> bool:
        return self.settings.flag(AUTO_MODE_SETTING)

    def exceeds_context_limit(self, agent_id: int) -> bool:
        return self.context_limit.tokens(agent_id) is not None

    def allows_stop_with_tasks(self, agent_id: int) -> bool:
        return self.context_limit.needs_compaction(agent_id)

    def urgent(self, excluded_id: int | None = None) -> Task | None:
        most_urgent = self.tasks.next_open(excluded_id, self.plan_tasks.plan_exclusion())
        return most_urgent if most_urgent is not None and most_urgent.priority >= URGENT_PRIORITY else None

    def reserved(self, agent_id: int, excluded_id: int | None = None) -> Task | None:
        return self.plan_order.first_started_plan_task(tuple(task for task in self.tasks.assigned_ready(agent_id) if task.id != excluded_id))

    def following(self, agent_id: int, excluded_id: int | None = None) -> Task | None:
        choice = self.choices.find(agent_id, excluded_id)
        if choice is not None:
            return choice
        open_task = self.tasks.next_open(excluded_id, self.plan_tasks.plan_exclusion())
        if open_task is not None and open_task.priority >= URGENT_PRIORITY:
            return open_task
        planned = self.focused.first_started(self.queries.query(Agent).find(agent_id), excluded_id)
        if planned is not None:
            return planned
        return open_task if open_task is not None else self.reserved(agent_id, excluded_id)
