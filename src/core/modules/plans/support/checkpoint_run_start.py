from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.scope.actor_scope import ActorScope
from engine.scope.scopes import Scopes
from core.modules.plans.commands.start_checkpoint_run.start_checkpoint_run import StartCheckpointRun
from core.modules.plans.support.checkpoint_runs import CheckpointRuns
from core.modules.plans.support.plan_checkpoints import PlanCheckpoints


class CheckpointRunStart:
    """Starts the run of the oldest running reach of a plan: what the run needs from outside the database, such as
    its checkout, is made first, and one short write starts it, so no other write waits on a checkout or a diff."""

    def __init__(self, bus: Bus, scopes: Scopes, checkpoints: PlanCheckpoints, runs: CheckpointRuns) -> None:
        self.bus, self.scopes, self.checkpoints, self.runs = bus, scopes, checkpoints, runs

    def start(self, plan_id: int, environment_id: int, cause_id: int | None = None) -> None:
        with self.scopes.command_scope([ActorScope], Actor.core(), environment_id):
            reach = self.checkpoints.oldest_running(plan_id)
            if reach is None:
                return
            preparation = self.runs.prepared(reach)
        self.bus.run(StartCheckpointRun(preparation), Actor.core(), cause_id=cause_id, environment_id=environment_id)
