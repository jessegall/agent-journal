from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit_listener import CommitListener
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.lifecycles.checkpoint_lifecycle import CheckpointLifecycle
from core.modules.plans.commands.start_checkpoint_run.start_checkpoint_run import StartCheckpointRun


class CheckpointRunListener(CommitListener[Created[CheckpointReach] | Moved[CheckpointReach]]):
    """A checkpoint of a plan that is reached has its run started by the journal: no agent runs it. When a run
    of a plan ends, the oldest reach of that plan that still runs is started, so a reach that waited for it
    gets its turn."""

    name = "plans.checkpoint-run-start"
    moves = [CheckpointLifecycle.passed, CheckpointLifecycle.failed]

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Created[CheckpointReach] | Moved[CheckpointReach], logged: LoggedEvent) -> None:
        self.bus.run(StartCheckpointRun(event.row.plan_id), Actor.core(), cause_id=logged.id, environment_id=event.row.environment_id)
