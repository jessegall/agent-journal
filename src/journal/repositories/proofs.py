from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.proof import Proof
from journal.models.task import Task
from journal.repositories.linked_rows import LinkedRows
from journal.repositories.links import Links
from journal.repositories.scope import Scope
from journal.repositories.scoped_repository import ScopedRepository

PROOF_LINK = "proves"


class Proofs(ScopedRepository[Proof], LinkedRows):
    link_kind = PROOF_LINK
    model = Proof

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links) -> None:
        super().__init__(connection, bus, scope)
        self.links = links

    def task_proofs(self, task: Task) -> list[Proof]:
        return sorted(self.children(task), key=lambda proof: proof.point)

    def changed_point_proofs(self, task: Task, points: tuple[int, ...]) -> list[Proof]:
        return [proof for proof in self.children(task) if proof.point in points]

    def point_proofs(self, task: Task, point: int) -> list[Proof]:
        return sorted((proof for proof in self.children(task) if proof.point == point), key=lambda proof: proof.row_id)
