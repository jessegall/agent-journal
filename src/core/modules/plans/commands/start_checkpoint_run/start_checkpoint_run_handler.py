from engine.command.context import Context
from engine.command.handler import Handler
from engine.scope.actor_scope import ActorScope
from core.modules.plans.commands.start_checkpoint_run.start_checkpoint_run import StartCheckpointRun
from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from core.modules.plans.support.checkpoint_runs import CheckpointRuns
from core.modules.plans.support.plan_checkpoints import PlanCheckpoints


class StartCheckpointRunHandler(Handler[StartCheckpointRun, None]):
    """Starts the run of the oldest reach of the plan that still runs."""

    command = StartCheckpointRun
    runs_once = True
    disabled_scopes = [ActorScope]

    def __init__(self, checkpoints: PlanCheckpoints, runs: CheckpointRuns) -> None:
        self.checkpoints, self.runs = checkpoints, runs

    def handle(self, command: StartCheckpointRun, context: Context) -> None:
        running = [reach for reach in self.checkpoints.reaches(command.plan_id) if reach.state is CheckpointState.RUNNING]
        if running:
            self.runs.start(running[0], context)
