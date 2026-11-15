from engine.command.context import Context
from engine.command.handler import Handler
from engine.scope.actor_scope import ActorScope
from core.modules.plans.commands.rerun_stale_checkpoints.rerun_stale_checkpoints import RerunStaleCheckpoints
from core.modules.plans.support.plan_checkpoints import PlanCheckpoints


class RerunStaleCheckpointsHandler(Handler[RerunStaleCheckpoints, None]):
    """Hands the look at a plan's stale failed checkpoint runs to PlanCheckpoints."""

    command = RerunStaleCheckpoints
    disabled_scopes = [ActorScope]

    def __init__(self, checkpoints: PlanCheckpoints) -> None:
        self.checkpoints = checkpoints

    def handle(self, command: RerunStaleCheckpoints, context: Context) -> None:
        self.checkpoints.rerun_stale(command.plan_id, context)
