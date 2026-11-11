from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.event_rows import EventRows
from engine.scope.actor_scope import ActorScope
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from suites.coding.modules.workers.commands.start_checkpoint_run.start_checkpoint_run import StartCheckpointRun
from suites.coding.modules.workers.support.checkpoint_runner import CheckpointRunner


class StartCheckpointRunHandler(Handler[StartCheckpointRun, None]):
    """Starts the run of a reach that still runs; a reach that ended is left as it is."""

    command = StartCheckpointRun
    runs_once = True
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, runner: CheckpointRunner) -> None:
        self.rows, self.runner = rows, runner

    def handle(self, command: StartCheckpointRun, context: Context) -> None:
        reach = self.rows.required(CheckpointReach, command.reach_id)
        if reach.state is CheckpointState.RUNNING:
            self.runner.start(reach, context)
