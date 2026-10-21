from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.support.actor import Actor
from journal.models.link import Link
from journal.support.ref import Ref
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.links import Links
from journal.support.not_found import NotFound
from journal.support.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository


WORKS_ON = "works_on"


class Workers(ScopedRepository[Worker]):
    model = Worker

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links) -> None:
        super().__init__(connection, bus, scope)
        self.links = links

    def out(self) -> list[Worker]:
        return self.where(state=WorkerState.DISPATCHED)

    def put_on(self, worker: Worker, task: int, actor: Actor) -> None:
        target = Ref("tasks", task)
        if not self.links.is_row(target):
            raise NotFound("tasks", task)
        self.links.save(Link(source=Ref.to(worker), target=target, kind=WORKS_ON), actor)

    def holding(self, task_ids: set[int]) -> dict[int, Worker]:
        held = {}
        for worker in self.across_environments(state=WorkerState.DISPATCHED):
            for ref in self.links.targets(worker, WORKS_ON):
                if ref.id in task_ids:
                    held[ref.id] = worker
        return held

    def reports_waiting(self) -> list[Worker]:
        return [worker for worker in self.in_state_reported() if worker.has_report_waiting()]

    def in_state_reported(self) -> list[Worker]:
        return self.where(state=WorkerState.REPORTED)

    def by_session(self, session: str) -> list[Worker]:
        return [w for w in self.in_() if session and session in (w.session, w.resume)]
