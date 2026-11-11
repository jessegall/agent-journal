from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit_listener import CommitListener
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.lifecycles.checkpoint_lifecycle import CheckpointLifecycle
from suites.coding.modules.workers.commands.return_checkpoint_tasks.return_checkpoint_tasks import ReturnCheckpointTasks
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.commands.report_returned_tasks.report_returned_tasks import ReportReturnedTasks


class CheckpointFailureListener(CommitListener[Moved[CheckpointReach]]):
    """A failed run of a checkpoint returns its tasks: each is opened again, the worker whose merged work held
    it gets it back in a new worktree cut from the head of the environment's branch, and is told the outputs
    of the tests that failed."""

    name = "workers.checkpoint-failure"
    moves = [CheckpointLifecycle.failed]

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: Moved[CheckpointReach], logged: LoggedEvent) -> None:
        reach = event.row
        for returned in self.bus.run(ReturnCheckpointTasks(reach.id), Actor.core(), cause_id=logged.id, environment_id=reach.environment_id):
            self.bus.run(SendWorker(returned.worker_id, task_ids=returned.task_ids), Actor.core(), cause_id=logged.id, environment_id=reach.environment_id)
            self.bus.run(ReportReturnedTasks(reach.phase_id, returned), Actor.core(), cause_id=logged.id, environment_id=reach.environment_id)
