from engine.command.context import Context
from engine.command.handler import Handler
from core.modules.plans.commands.check_plan.check_plan import CheckPlan
from core.modules.plans.support.early_run import EarlyRun
from core.modules.plans.support.plan_checkpoints import PlanCheckpoints


class CheckPlanHandler(Handler[CheckPlan, EarlyRun]):
    """Hands the early run of a checkpoint window to PlanCheckpoints."""

    command = CheckPlan

    def __init__(self, checkpoints: PlanCheckpoints) -> None:
        self.checkpoints = checkpoints

    def handle(self, command: CheckPlan, context: Context) -> EarlyRun:
        return self.checkpoints.run_early(command.plan_id, context)
