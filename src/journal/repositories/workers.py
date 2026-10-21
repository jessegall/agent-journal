from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.support.actor import Actor
from journal.models.link import Link
from journal.support.ref import Ref
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.links import Links
from journal.support.missing_row import MissingRow
from journal.support.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository


WORKER_LINK = "works_on"


class Workers(ScopedRepository[Worker]):
    model = Worker

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links) -> None:
        super().__init__(connection, bus, scope)
        self.links = links

    def active(self) -> list[Worker]:
        return self.matching(state=WorkerState.DISPATCHED)

    def assign(self, worker: Worker, task: int, actor: Actor) -> None:
        target = Ref("tasks", task)
        if not self.links.is_row(target):
            raise MissingRow("tasks", task)
        self.links.save(Link(source=Ref.build(worker), target=target, kind=WORKER_LINK), actor)

    def containing(self, task_ids: set[int]) -> dict[int, Worker]:
        blocked = {}
        for worker in self.global_matching(state=WorkerState.DISPATCHED):
            for ref in self.links.targets(worker, WORKER_LINK):
                if ref.id in task_ids:
                    blocked[ref.id] = worker
        return blocked

    def reports_waiting(self) -> list[Worker]:
        return [worker for worker in self.reported() if worker.has_report_waiting()]

    def reported(self) -> list[Worker]:
        return self.matching(state=WorkerState.REPORTED)

    def session_worker(self, session: str) -> list[Worker]:
        return [w for w in self.scoped() if session and session in (w.session, w.resume)]
