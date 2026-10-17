from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.scoped_repository import ScopedRepository


class Workers(ScopedRepository[Worker]):
    model = Worker

    def out(self) -> list[Worker]:
        return self.where(environment_id=self.scope.id, state=WorkerState.DISPATCHED)

    def by_session(self, session: str) -> list[Worker]:
        """The workers whose own session this is: a command run from a worker's shell."""
        return [w for w in self.in_() if session and session in (w.session, w.resume)]
