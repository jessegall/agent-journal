from engine.database.kept_rows import KeptRows
from engine.query.conditions.equal import Equal
from engine.query.conditions.excluding import Excluding
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_progress import PlanProgress
from engine.query.queries import Queries
from core.modules.plans.support.plan_assignee import PlanAssignee
from core.modules.plans.support.task_plans import TaskPlans
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.queries.task_query import TASK_PAGE_ROWS, TaskQuery
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from suites.coding.modules.workers.support.work_unit import WorkUnit


class WorkUnits:
    """Reads the unit of a worker: the ids of its assigned tasks that are not closed, and the plan whose agent it
    is, or else the one phase all of them belong to. The one reader of a worker's plan, so the move of plan
    assignment to the assignments table changes only here. Counts are counted, never read row by row."""

    def __init__(self, tasks: TaskQuery, plans: TaskPlans, agents: AgentRows, queries: Queries, kept: KeptRows) -> None:
        self.tasks, self.plans, self.agents, self.queries, self.kept = tasks, plans, agents, queries, kept

    def plan_worker(self, plan: Plan) -> Agent | None:
        agent_id = PlanAssignee.agent_id(plan)
        agent = self.agents.find(agent_id) if agent_id is not None else None
        return agent if agent is not None and agent.role == CodingHelperRole.WORKER and agent.retired_at is None else None

    def unit(self, worker_id: int) -> WorkUnit:
        assignee = TaskQuery.assignee(worker_id).statement()
        return self.kept.read("tasks", lambda: self.loaded_unit(worker_id), f"closed_at IS NULL AND {assignee.sql}", assignee.parameters, name="workers.work_unit")

    def loaded_unit(self, worker_id: int) -> WorkUnit:
        open_work = self.tasks.assignee_tasks(worker_id).unclosed()
        task_ids = tuple(task.id for task in open_work.oldest().all_rows(TASK_PAGE_ROWS))
        uncommitted_count = open_work.matching(Excluding(Equal("state", TaskState.TESTING))).count()
        self.plans.prepare(task_ids)
        plan = self.assigned_plan(worker_id, task_ids)
        phase = None if plan is not None else self.shared_phase(task_ids)
        if plan is None:
            return WorkUnit(plan, phase, task_ids, uncommitted_count, len(task_ids), uncommitted_count)
        progress = self.queries.query(PlanProgress).find(plan.id)
        return WorkUnit(plan, phase, task_ids, uncommitted_count, progress.task_count, progress.task_count - progress.completed_count - progress.testing_count)

    def assigned_plan(self, worker_id: int, task_ids: tuple[int, ...]) -> Plan | None:
        plan = self.plans.find(task_ids[0]) if task_ids else None
        return plan if plan is not None and PlanAssignee.agent_id(plan) == worker_id else None

    def shared_phase(self, task_ids: tuple[int, ...]) -> Phase | None:
        phases = [self.plans.find_phase(task_id) for task_id in task_ids]
        phase_ids = {phase.id if phase is not None else None for phase in phases}
        return phases[0] if len(phase_ids) == 1 else None
