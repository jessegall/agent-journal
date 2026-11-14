from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.plans.commands.repair_plan_states.repair_plan_states import RepairPlanStates
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_wait import PlanWait
from core.modules.plans.support.plan_waits import PlanWaits
from core.modules.tasks.support.task_waits import TaskWaits

PLAN_TARGET = "plans:"
ENDED_PLAN_STATES = (PlanState.COMPLETED, PlanState.CANCELLED)
OPEN_WAITS_REASON = "every blocked plan and its open waits are checked against the plans they wait on"


class RepairPlanStatesHandler(Handler[RepairPlanStates, int]):
    """Ends the waits on each plan that has ended, which opens the plans and tasks whose last wait it was."""

    command = RepairPlanStates

    def __init__(self, queries: Queries, plan_waits: PlanWaits, task_waits: TaskWaits) -> None:
        self.queries, self.plan_waits, self.task_waits = queries, plan_waits, task_waits

    def handle(self, command: RepairPlanStates, context: Context) -> int:
        blocked_ids = [plan.id for plan in self.queries.query(Plan).filter(state=PlanState.BLOCKED).every_row(OPEN_WAITS_REASON)]
        open_waits = tuple(self.queries.query(PlanWait).where_in("plan_id", blocked_ids).matching(IsNull("ended_at")).every_row(OPEN_WAITS_REASON))
        task_waits = [(wait, int(wait.target.removeprefix(PLAN_TARGET))) for wait in self.task_waits.pending_rows() if wait.target.startswith(PLAN_TARGET)]
        blocker_ids = sorted({wait.blocker_id for wait in open_waits} | {plan_id for _, plan_id in task_waits})
        ended = {plan.id: plan for plan in self.queries.query(Plan).find_many(blocker_ids) if plan.state in ENDED_PLAN_STATES}
        for plan in ended.values():
            self.plan_waits.ended(plan, context)
        stale_task_waits = [wait for wait, plan_id in task_waits if plan_id in ended]
        self.task_waits.resolved(stale_task_waits, context)
        return sum(wait.blocker_id in ended for wait in open_waits) + len(stale_task_waits)
