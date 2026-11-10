from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.errors.refusal import Refusal
from core.modules.plans.commands.block_plan.block_plan import BlockPlan
from core.modules.plans.commands.wait_plan.wait_plan import WaitPlan
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_wait import PlanWait
from core.modules.plans.support.plan_waits import PlanWaits

TARGET_HELP = "write --on plan:<n>"
ENDED_STATES = (PlanState.COMPLETED, PlanState.CANCELLED)


class WaitPlanHandler(Handler[WaitPlan, Plan]):
    """Blocks a plan until the plans it waits on have ended, or until someone unblocks it."""

    command = WaitPlan

    def __init__(self, bus: Bus, queries: Queries, repository: Repository, waits: PlanWaits) -> None:
        self.bus, self.queries, self.repository, self.waits = bus, queries, repository, waits

    def handle(self, command: WaitPlan, context: Context) -> Plan:
        blockers = tuple(self.blocker(text, command.plan_id) for text in command.targets)
        reason = command.reason.strip() or command.wait_reason()
        if not reason:
            raise Refusal("say what it waits on", f'{TARGET_HELP}, or --reason "<words>"')
        plan = self.bus.dispatch(BlockPlan(command.plan_id, reason), context)
        for blocker in blockers:
            self.repository.save(PlanWait(plan_id=plan.id, creator_id=context.actor.id, blocker_id=blocker.id), context)
        return plan

    def blocker(self, text: str, plan_id: int) -> Plan:
        target_type, _, row_id = text.partition(":")
        if target_type != "plan" or not row_id.isdigit():
            raise Refusal(f"{text} gives nothing to wait on", TARGET_HELP)
        if int(row_id) == plan_id:
            raise Refusal(f"plan {plan_id} cannot wait on itself", "name another plan")
        blocker = self.queries.query(Plan).find(int(row_id))
        if blocker.state in ENDED_STATES:
            raise Refusal(f"plan {blocker.id} is {blocker.state.value} already", "nothing waits on it; carry on with the plan")
        if self.waits.reaches(blocker.id, plan_id):
            raise Refusal(f"plan {blocker.id} waits on plan {plan_id} already, so this would be a loop", "end one of the two waits first")
        return blocker
