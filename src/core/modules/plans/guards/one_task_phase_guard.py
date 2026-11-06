from core.base.change.moved import Moved
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_task import PlanTask
from core.modules.tasks.models.enums.task_state import TaskState


class OneTaskPhaseGuard(Guard[Moved[Plan]]):
    """Refuses a plan's move to ready while a phase has one task, unless the guard is passed with a reason."""

    name = "plans.one-task-phase"
    moves = tuple([PlanLifecycle.ready])

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Moved[Plan], context: Context) -> None:
        tasks = [task for task in self.queries.query(PlanTask).filter(plan_id=event.row.id).all_rows() if task.state is not TaskState.CANCELLED]
        phase_ids = sorted({task.phase_id for task in tasks})
        single = [phase_id for phase_id in phase_ids if sum(task.phase_id == phase_id for task in tasks) == 1]
        if single:
            raise Refusal(f"phase {single[0]} of plan {event.row.id} has one task" + (f", and so do phases {', '.join(map(str, single[1:]))}" if single[1:] else ""),
                          "split each phase into its real steps, one task a person could check, or say why one is enough with --skip-guard plans.one-task-phase --skip-reason \"<why>\"")
