from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.plans.models.plan_task import PlanTask
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_dependency import TaskDependency


UNCANCELLED_STATES = [state for state in TaskState if state is not TaskState.CANCELLED]


class PlanOrder:
    """Finds the tasks of a plan that do not state what they wait on: every task but the plan's first states a
    dependency or says why it waits on nothing."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def unordered(self, plan_id: int) -> tuple[int, ...]:
        placed = self.queries.query(PlanTask).filter(plan_id=plan_id).matching(Among("state", UNCANCELLED_STATES)).all_rows()
        later = [task.task_id for task in sorted(placed, key=lambda task: (task.phase_position, task.position))[1:]]
        waiting = {dependency.task_id for dependency in self.queries.query(TaskDependency).matching(Among("task_id", later)).all_rows()}
        declared = {task.id for task in self.queries.query(Task).find_many(later) if task.independence_reason}
        return tuple(task_id for task_id in later if task_id not in waiting | declared)

    def refusal_text(self, plan_id: int) -> str | None:
        unordered = self.unordered(plan_id)
        if not unordered:
            return None
        return f"of plan {plan_id}, this states no order: {', '.join(f'task {task_id}' for task_id in unordered)}"
