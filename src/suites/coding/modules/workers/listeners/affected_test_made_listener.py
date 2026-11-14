from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from suites.coding.modules.workers.models.affected_test import AffectedTest
from suites.coding.modules.workers.listeners.support.worker_test_starts import WorkerTestStarts


class AffectedTestMadeListener(CommitListener[Created[AffectedTest]]):
    """A new affected-test pick waits for room: the queued worker tests start when there is room."""

    name = "workers.affected-test-made"

    def __init__(self, starts: WorkerTestStarts) -> None:
        self.starts = starts

    def handle(self, event: Created[AffectedTest], logged: LoggedEvent) -> None:
        self.starts.start_next(logged)
