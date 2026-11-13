from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from suites.coding.modules.workers.commands.queue_worker_tests.start_worker_tests import StartWorkerTests


class WorkerTestStarts:
    """Starts the queued worker tests there is room for, caused by the event that made the room."""

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def start_next(self, logged: LoggedEvent) -> None:
        self.bus.run(StartWorkerTests(), Actor.core(), cause_id=logged.id)
