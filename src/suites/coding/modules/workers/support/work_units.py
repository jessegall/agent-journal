from core.modules.plans.conditions.plan_tasks_condition import PlanTasksCondition
from engine.database.kept_rows import KeptRows
from engine.query.conditions.equal import Equal
from engine.query.conditions.excluding import Excluding
from engine.query.conditions.minimum import Minimum
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_progress import PlanProgress
from engine.query.queries import Queries
from core.modules.plans.support.plan_assignee import PlanAssignee
from core.modules.plans.support.task_plans import TaskPlans
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from suites.coding.modules.workers.support.work_unit import WorkUnit
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery

UNIT_TASKS_REASON = "a worker's unit is every task assigned to it, which can hold more than fifty"

CLOSED_NEVER = "9999"


class WorkUnits:
    """Reads the unit of a worker: the ids of its assigned tasks that are not closed or were completed since its
    worktree was cut, and the plan whose agent it is, or else the one phase all of them belong to. The one reader of a worker's plan, so the move of plan
    assignment to the assignments table changes only here. Counts are counted, never read row by row."""

    def __init__(self, tasks: TaskQuery, plans: TaskPlans, agents: AgentRows, queries: Queries, kept: KeptRows, worktrees: WorktreeQuery) -> None:
        self.tasks, self.plans, self.agents, self.queries, self.kept, self.worktrees = tasks, plans, agents, queries, kept, worktrees

    def plan_worker(self, plan: Plan) -> Agent | None:
        agent_id = PlanAssignee.agent_id(plan)
        agent = self.agents.find(agent_id) if agent_id is not None else None
        return agent if agent is not None and agent.role == CodingHelperRole.WORKER and agent.retired_at is None else None

    def unit(self, worker_id: int) -> WorkUnit:
        worktree = self.worktrees.worker_worktree(worker_id)
        cut_text = worktree.cut_at.text if worktree is not None and worktree.cut_at is not None else CLOSED_NEVER
        task_ids, uncommitted_count = self.kept.read(self.tasks.assignee_tasks(worker_id), lambda: self.open_work(worker_id, cut_text), name=f"workers.work_unit_tasks:{cut_text}")
        self.plans.prepare(task_ids)
        plan = self.assigned_plan(worker_id, task_ids)
        phase = None if plan is not None else self.shared_phase(task_ids)
        if plan is None:
            return WorkUnit(plan, phase, task_ids, uncommitted_count, len(task_ids), uncommitted_count)
        plan_tasks = self.queries.query(Task).matching(PlanTasksCondition(tuple([plan.id])))
        progress = self.kept.read(plan_tasks, lambda: self.queries.query(PlanProgress).find(plan.id), name="workers.unit_plan_progress")
        return WorkUnit(plan, phase, task_ids, uncommitted_count, progress.task_count, progress.task_count - progress.completed_count - progress.testing_count)

    def open_work(self, worker_id: int, cut_text: str) -> tuple[tuple[int, ...], int]:
        open_work = self.tasks.assignee_tasks(worker_id).unclosed()
        open_ids = tuple(task.id for task in open_work.every_row(UNIT_TASKS_REASON))
        completed = self.tasks.assignee_tasks(worker_id).filter(state=TaskState.COMPLETED).matching(Minimum("closed_at", cut_text))
        completed_ids = tuple(task.id for task in completed.every_row(UNIT_TASKS_REASON))
        return tuple(sorted({*open_ids, *completed_ids})), open_work.matching(Excluding(Equal("state", TaskState.TESTING))).count()

    def assigned_plan(self, worker_id: int, task_ids: tuple[int, ...]) -> Plan | None:
        plan = self.plans.find(task_ids[0]) if task_ids else None
        return plan if plan is not None and PlanAssignee.agent_id(plan) == worker_id else None

    def shared_phase(self, task_ids: tuple[int, ...]) -> Phase | None:
        phases = [self.plans.find_phase(task_id) for task_id in task_ids]
        phase_ids = {phase.id if phase is not None else None for phase in phases}
        return phases[0] if len(phase_ids) == 1 else None
