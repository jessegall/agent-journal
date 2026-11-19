from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.event.logged_event import LoggedEvent
from engine.scope.scopes import Scopes
from suites.coding.modules.workers.commands.queue_worker_tests.start_worker_tests import StartWorkerTests
from suites.coding.modules.workers.support.worker_test_planner import WorkerTestPlanner


class WorkerTestStarts:
    """Starts the queued worker tests there is room for: their checkouts are made first, and one short write starts
    them, so no other write waits on git."""

    def __init__(self, bus: Bus, scopes: Scopes, planner: WorkerTestPlanner) -> None:
        self.bus, self.scopes, self.planner = bus, scopes, planner

    # caused by the event that made the room, in that event's scope
    def start_next(self, logged: LoggedEvent) -> None:
        self.bus.run(StartWorkerTests(self.planner.planned()), Actor.core(), cause_id=logged.id)

    def start_in(self, environment_id: int) -> None:
        with self.scopes.command_scope((), Actor.core(), environment_id):
            plan = self.planner.planned()
        self.bus.run(StartWorkerTests(plan), Actor.core(), environment_id=environment_id)
