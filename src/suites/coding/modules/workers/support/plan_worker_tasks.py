from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_outlines import PlanOutlines
from core.modules.tasks.models.enums.task_state import UNSTARTED_STATES, TaskState

HANDED_STATES = (PlanState.APPROVED, PlanState.STARTED)


class PlanWorkerTasks:
    """Picks the tasks a worker is dispatched to for a plan or for one phase of it: those still open and not
    queued for another agent, in the plan's order, phase by phase."""

    def __init__(self, queries: Queries, outlines: PlanOutlines) -> None:
        self.queries, self.outlines = queries, outlines

    def task_ids(self, plan_id: int, phase_id: int | None) -> tuple[int, ...]:
        plan = self.queries.query(Plan).find(plan_id)
        if plan.state not in HANDED_STATES:
            raise Refusal(f"plan {plan.id} is {plan.state.value}", "only an approved or started plan goes to a worker")
        phases = self.outlines.outline(plan.id).chosen(phase_id)
        tasks = tuple(task for phase in phases for task in phase.tasks if task.helper_id is None and task.state in UNSTARTED_STATES)
        first = next((task for task in tasks if task.state == TaskState.OPEN.value), None)
        task_ids = tuple(task.id for task in tasks)
        if first is not None:
            task_ids = (first.id, *(task.id for task in tasks if task.id != first.id))
        if not task_ids:
            raise Refusal("no open task is left to hand to a worker", "every task there is closed, started or queued for an agent already")
        return task_ids
