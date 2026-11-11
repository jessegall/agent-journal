from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.listener.commit_listener import CommitListener
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from suites.coding.modules.workers.commands.start_checkpoint_run.start_checkpoint_run import StartCheckpointRun


class CheckpointRunListener(CommitListener[Created[CheckpointReach]]):
    """A checkpoint of a plan that is reached has its tests started by the journal: no agent runs them."""

    name = "workers.checkpoint-run"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Created[CheckpointReach], logged: LoggedEvent) -> None:
        self.bus.run(StartCheckpointRun(event.row.id), Actor.core(), cause_id=logged.id, environment_id=event.row.environment_id)
