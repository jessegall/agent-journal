from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_outlines import PlanOutlines
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.support.task_waits import TaskWaits

HANDED_STATES = (PlanState.APPROVED, PlanState.STARTED)


class PlanWorkerTasks:
    """Picks the tasks a worker is dispatched to for a plan or for one phase of it: those still open and not
    queued for another agent, in the plan's order, phase by phase."""

    def __init__(self, queries: Queries, outlines: PlanOutlines, waits: TaskWaits) -> None:
        self.queries, self.outlines, self.waits = queries, outlines, waits

    def task_ids(self, plan_id: int, phase_id: int | None) -> tuple[int, ...]:
        plan = self.queries.query(Plan).find(plan_id)
        if plan.state not in HANDED_STATES:
            raise Refusal(f"plan {plan.id} is {plan.state.value}", "only an approved or started plan goes to a worker")
        phases = self.outlines.outline(plan.id).phases
        if phase_id is not None:
            phases = tuple(phase for phase in phases if phase.id == phase_id)
            if not phases:
                raise Refusal(f"phase {phase_id} is not in plan {plan.id}", f"journal plan outline {plan.id} lists its phases")
        task_ids = tuple(task.id for phase in phases for task in phase.tasks if task.helper_id is None and
                         (task.state == TaskState.OPEN.value or (task.state == TaskState.BLOCKED.value and self.waits.waits_target_tasks(task.id))))
        if not task_ids:
            raise Refusal("no open task is left to hand to a worker", "every task there is closed, started or queued for an agent already")
        return task_ids
