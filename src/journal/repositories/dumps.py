from journal.models.dump import Dump
from journal.repositories.scoped_repository import ScopedRepository


class Dumps(ScopedRepository[Dump]):
    model = Dump

    def standing(self) -> list[Dump]:
        return self.where(environment_id=self.scope.id, completed_at=0.0)

    def in_hand(self) -> Dump | None:
        return min(self.standing(), key=lambda d: (d.queued_at or d.created_at.timestamp(), d.id), default=None)
