from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.scope.actor_scope import ActorScope
from core.modules.plans.commands.start_checkpoint_run.start_checkpoint_run import StartCheckpointRun
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from core.modules.plans.support.checkpoint_runs import CheckpointRuns


class StartCheckpointRunHandler(Handler[StartCheckpointRun, None]):
    """Starts the run of the reach it was prepared for while that reach still runs; a reach that ended between
    its preparation and this write is left as it is."""

    command = StartCheckpointRun
    runs_once = True
    disabled_scopes = [ActorScope]

    def __init__(self, rows: EventRows, runs: CheckpointRuns) -> None:
        self.rows, self.runs = rows, runs

    def handle(self, command: StartCheckpointRun, context: Context) -> None:
        reach = self.rows.required(CheckpointReach, command.preparation.reach_id)
        if reach.state is CheckpointState.RUNNING:
            self.runs.start(reach, command.preparation, context)
