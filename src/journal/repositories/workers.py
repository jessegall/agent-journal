from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.scoped_repository import ScopedRepository


class Workers(ScopedRepository[Worker]):
    model = Worker

    def out(self) -> list[Worker]:
        return self.where(environment_id=self.scope.id, state=WorkerState.DISPATCHED)
