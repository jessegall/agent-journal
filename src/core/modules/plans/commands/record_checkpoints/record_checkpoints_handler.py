from engine.command.context import Context
from engine.command.handler import Handler
from engine.scope.actor_scope import ActorScope
from core.modules.plans.commands.record_checkpoints.record_checkpoints import RecordCheckpoints
from core.modules.plans.support.plan_checkpoints import PlanCheckpoints


class RecordCheckpointsHandler(Handler[RecordCheckpoints, None]):
    """Hands the look at a plan's checkpoints to PlanCheckpoints."""

    command = RecordCheckpoints
    disabled_scopes = [ActorScope]

    def __init__(self, checkpoints: PlanCheckpoints) -> None:
        self.checkpoints = checkpoints

    def handle(self, command: RecordCheckpoints, context: Context) -> None:
        self.checkpoints.record(command.plan_id, context)
