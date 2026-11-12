from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.commands.record_checkpoint_test.record_checkpoint_test import RecordCheckpointTest
from suites.coding.modules.workers.models.checkpoint_test import RUNNING_STATES, CheckpointTest


class CheckpointTestEndListener(CommitListener[Moved[Process]]):
    """A process that ended is recorded on the test of a checkpoint run it ran for."""

    name = "workers.checkpoint-test-ends"
    moves = [ProcessLifecycle.finish, ProcessLifecycle.fail, ProcessLifecycle.stop, ProcessLifecycle.orphan]

    def __init__(self, queries: Queries, bus: Bus) -> None:
        self.queries, self.bus = queries, bus

    def handle(self, event: Moved[Process], logged: LoggedEvent) -> None:
        process = event.row
        test = self.queries.query(CheckpointTest).filter(process_id=process.id).matching(Among("state", RUNNING_STATES)).first()
        if test is None or process.ended_at is None:
            return
        passed = process.succeeded
        self.bus.run(RecordCheckpointTest(test.id, passed), Actor.core(), cause_id=logged.id, environment_id=process.environment_id)
