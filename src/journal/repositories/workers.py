from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.scoped_repository import ScopedRepository


class Workers(ScopedRepository[Worker]):
    model = Worker

    def out(self, environment_id: int) -> list[Worker]:
        return self.where(environment_id=environment_id, state=WorkerState.DISPATCHED)
