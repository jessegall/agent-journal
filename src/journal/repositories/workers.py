from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.actor import Actor
from journal.models.link import Link
from journal.models.ref import Ref
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.links import Links
from journal.repositories.not_found import NotFound
from journal.repositories.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository


WORKS_ON = "works_on"
"""The link from a worker to the task it was dispatched on, so the plan holding the task leaves it to the worker and the viewer shows who holds it."""


class Workers(ScopedRepository[Worker]):
    model = Worker

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links) -> None:
        super().__init__(connection, bus, scope)
        self.links = links

    def out(self) -> list[Worker]:
        return self.where(environment_id=self.scope.id, state=WorkerState.DISPATCHED)

    def put_on(self, worker: Worker, task: int, by: Actor) -> None:
        """The worker recorded as working on the task, which must be there."""
        target = Ref("tasks", task)
        if not self.links.is_row(target):
            raise NotFound("tasks", task)
        self.links.save(Link(source=Ref.to(worker), target=target, kind=WORKS_ON), by)

    def holding(self, task_ids: set[int]) -> dict[int, Worker]:
        """By task number, the worker still out on each of these tasks."""
        held = {}
        for worker in self.where(state=WorkerState.DISPATCHED):
            for ref in self.links.targets(worker, WORKS_ON):
                if ref.id in task_ids:
                    held[ref.id] = worker
        return held

    def reports_waiting(self) -> list[Worker]:
        """The workers here whose last report the agent has not acted on yet."""
        return [worker for worker in self.in_state_reported() if worker.has_report_waiting()]

    def in_state_reported(self) -> list[Worker]:
        return self.where(environment_id=self.scope.id, state=WorkerState.REPORTED)

    def by_session(self, session: str) -> list[Worker]:
        """The workers whose own session this is: a command run from a worker's shell."""
        return [w for w in self.in_() if session and session in (w.session, w.resume)]
