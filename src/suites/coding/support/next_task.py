from collections import defaultdict
from collections.abc import Sequence

from engine.module.task_assigner import TaskAssigner
from engine.query.conditions.among import Among
from core.modules.assignments.queries.conditions.assignee_among import AssigneeAmong
from core.modules.assignments.support.assignments import Assignments
from core.modules.tasks.models.enums.task_state import TaskState
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
from suites.coding.support.rule_reserved_tasks import RuleReservedTasks

AGENT_TASKS_REASON = "the own tasks of an agent are every task it holds or is assigned"

BLOCKED_TASK_PAGE_SIZE = 10


class NextTask(TaskAssigner[Task]):
    """The coding suite's task assigner: an agent with empty hands is given the task it was told to take next,
    else a task above high outside any plan, else the next task of its plan focus (a ready task of that plan
    or an open task the plan waits on), else a task an assign rule reserved for it, else the next task of the
    oldest started plan, else the most urgent open task outside any plan that waits on nothing, else, last, a
    task reserved for it, which stays open and is never one the agent released just now. A task reserved for the agent that is work of its focus is given
    at the focus step. An agent with tasks still in hand is given only the task above high. Auto mode turns it
    on, and an agent past its context limit is given nothing until its stop has compacted it. It also says
    which unfinished tasks are an agent's own: those assigned to it, and those it holds that are assigned to
    nobody else, never a task queued on another agent; and which tasks wait blocked with nothing to open them.
    """

    def __init__(self, tasks: TaskQuery, plan_tasks: NextPlanTasks, queries: Queries, settings: SettingValues, context_limit: ContextLimitCheck, plan_order: PlanTaskOrder, choices: NextTaskChoices, focused: FocusedPlanTasks, assignments: Assignments,
                 rule_tasks: RuleReservedTasks) -> None:
        self.tasks, self.plan_tasks, self.queries, self.settings, self.context_limit = tasks, plan_tasks, queries, settings, context_limit
        self.plan_order, self.choices, self.focused, self.assignments, self.rule_tasks = plan_order, choices, focused, assignments, rule_tasks

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
        return self.plan_order.first_started_plan_task(self.reserved_ready(agent_id, excluded_id))

    def rule_reserved(self, agent_id: int, excluded_id: int | None = None) -> Task | None:
        return self.plan_order.first_started_plan_task(self.rule_tasks.given(self.reserved_ready(agent_id, excluded_id), agent_id))

    def reserved_ready(self, agent_id: int, excluded_id: int | None) -> tuple[Task, ...]:
        return tuple(task for task in self.tasks.assigned_ready(agent_id) if task.id != excluded_id)

    def following(self, agent_id: int, excluded_id: int | None = None) -> Task | None:
        choice = self.choices.find(agent_id, excluded_id)
        if choice is not None:
            return choice
        open_task = self.tasks.next_open(excluded_id, self.plan_tasks.plan_exclusion())
        if open_task is not None and open_task.priority >= URGENT_PRIORITY:
            return open_task
        planned = self.focused.first_started(self.queries.query(Agent).find(agent_id), excluded_id, lambda: self.rule_reserved(agent_id, excluded_id))
        if planned is not None:
            return planned
        return open_task if open_task is not None else self.reserved(agent_id, excluded_id)

    def agent_tasks(self, agent_ids: Sequence[int]) -> dict[int, tuple[int, ...]]:
        tasks = self.queries.query(Task).matching(Among("state", [TaskState.OPEN, TaskState.STARTED])).ordered("id")
        blocked = tuple(tasks.matching(Among("holder_id", agent_ids)).every_row(AGENT_TASKS_REASON))
        assigned = tuple(tasks.matching(AssigneeAmong(Task, tuple(agent_ids))).every_row(AGENT_TASKS_REASON))
        actor_ids = self.assignments.row_actor_ids(Task, sorted({task.id for task in (*blocked, *assigned)}))
        agent_rows: dict[int, set[int]] = defaultdict(set)
        for task in blocked:
            assignees = actor_ids.get(task.id, ())
            if not assignees or task.holder_id in assignees:
                agent_rows[task.holder_id].add(task.id)
        for task in assigned:
            for agent_id in set(actor_ids.get(task.id, ())).intersection(agent_ids):
                agent_rows[agent_id].add(task.id)
        return {agent_id: tuple(sorted(ids)) for agent_id, ids in agent_rows.items()}

    def blocked_tasks(self) -> tuple[int, ...]:
        return tuple(task.id for task in self.tasks.unopenable_blocks().oldest().page(1, BLOCKED_TASK_PAGE_SIZE).rows)
