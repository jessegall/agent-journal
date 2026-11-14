from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from core.modules.plans.models.lifecycles.plan_lifecycle import PlanLifecycle
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_checkpoints import PlanCheckpoints
from core.modules.processes.commands.stop_process.stop_process import StopProcess
from suites.coding.modules.workers.support.checkpoint_results import CheckpointResults


class CancelledPlanRunListener(CommitListener[Moved[Plan]]):
    """A plan cancelled while a run of one of its checkpoints goes has the tests of that run stopped. The
    tasks keep their states and nobody is told of a result."""

    name = "workers.cancelled-plan-run"
    moves = [PlanLifecycle.cancel]

    def __init__(self, bus: Bus, checkpoints: PlanCheckpoints, results: CheckpointResults) -> None:
        self.bus, self.checkpoints, self.results = bus, checkpoints, results

    def handle(self, event: Moved[Plan], logged: LoggedEvent) -> None:
        for reach in self.checkpoints.reaches(event.row.id):
            if reach.state is not CheckpointState.RUNNING:
                continue
            for process_id in self.results.running_process_ids(reach):
                self.bus.run(StopProcess(process_id), Actor.core(), cause_id=logged.id, environment_id=event.row.environment_id)
