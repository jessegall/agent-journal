from journal.models.dump import Dump
from journal.repositories.scoped_repository import ScopedRepository


class Dumps(ScopedRepository[Dump]):
    model = Dump

    def data(self) -> list[Dump]:
        return self.matching(environment_id=self.scope.id, completed_at=0.0)

    def current(self) -> Dump | None:
        return min(self.data(), key=lambda d: (d.queued_at or d.created_at.timestamp(), d.id), default=None)
