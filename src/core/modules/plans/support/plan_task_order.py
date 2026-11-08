from collections.abc import Sequence

from core.base.database.kept_rows import KeptRows
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.plans.conditions.shared_plan_tasks import SharedPlanTasks
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_task import PlanTask
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task


WORKING_STATES = (TaskState.OPEN, TaskState.STARTED, TaskState.BLOCKED)


class PlanTaskOrder:
    """Picks which of an agent's ready tasks goes first. A plan's task is offered only while its phase is the
    earliest phase of the plan that still has a task open, started or blocked, the agent's own started tasks
    not counted, and the plan's order comes before task numbers. So a plan given to one agent runs phase by
    phase, and the tests at a phase's end hold the next phase back. A task reserved ahead of time can be held back
    until its plan starts."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def first(self, tasks: Sequence[Task], started_task_ids: Sequence[int] = ()) -> Task | None:
        if not tasks:
            return None
        return self.first_of(tasks, self.rows_of(tasks), started_task_ids)

    def first_in_started_plans(self, tasks: Sequence[Task]) -> Task | None:
        if not tasks:
            return None
        rows = self.rows_of(tasks)
        started_plan_ids = {plan.id for plan in self.queries.query(Plan).filter(state=PlanState.STARTED).all_rows()}
        waiting_task_ids = {row.task_id for row in rows if row.plan_id not in started_plan_ids}
        return self.first_of([task for task in tasks if task.id not in waiting_task_ids], rows, ())

    def rows_of(self, tasks: Sequence[Task]) -> tuple[PlanTask, ...]:
        return self.plan_rows(tuple(sorted(task.id for task in tasks)))

    def first_of(self, tasks: Sequence[Task], rows: tuple[PlanTask, ...], started_task_ids: Sequence[int]) -> Task | None:
        task_ids = tuple(task.id for task in tasks)
        positions = {row.task_id: row for row in rows if row.task_id in task_ids}
        plan_ids = {row.plan_id for row in positions.values()}
        working_rows = [row for row in rows if row.state in WORKING_STATES and row.task_id not in started_task_ids]
        plan_phases = {plan_id: min(row.phase_position for row in working_rows if row.plan_id == plan_id) for plan_id in plan_ids}
        ready_tasks = [task for task in tasks if task.id not in positions or positions[task.id].phase_position == plan_phases[positions[task.id].plan_id]]
        return min(ready_tasks, key=lambda task: self.order(task, positions), default=None)

    def plan_rows(self, task_ids: tuple[int, ...]) -> tuple[PlanTask, ...]:
        condition = SharedPlanTasks(task_ids).statement()
        return self.kept.read("tasks", lambda: self.loaded_plan_rows(task_ids), condition.sql, condition.parameters, name=f"plans.plan_rows:{task_ids}")

    def loaded_plan_rows(self, task_ids: tuple[int, ...]) -> tuple[PlanTask, ...]:
        plan_ids = tuple(sorted({row.plan_id for row in self.queries.query(PlanTask).matching(Among("task_id", task_ids)).all_rows()}))
        return tuple(self.queries.query(PlanTask).matching(Among("plan_id", plan_ids)).all_rows()) if plan_ids else ()

    @staticmethod
    def order(task: Task, positions: dict[int, PlanTask]) -> tuple[int, int, int, int]:
        row = positions.get(task.id)
        return (-task.priority, row.phase_position if row else 0, row.position if row else 0, task.id)
