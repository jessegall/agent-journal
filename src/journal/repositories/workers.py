from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.scoped_repository import ScopedRepository


class Workers(ScopedRepository[Worker]):
    model = Worker

    def out(self) -> list[Worker]:
        return self.where(environment_id=self.scope.id, state=WorkerState.DISPATCHED)

    def reports_waiting(self) -> list[Worker]:
        """The workers here whose last report the agent has not acted on yet."""
        return [worker for worker in self.in_state_reported() if worker.has_report_waiting()]

    def in_state_reported(self) -> list[Worker]:
        return self.where(environment_id=self.scope.id, state=WorkerState.REPORTED)

    def by_session(self, session: str) -> list[Worker]:
        """The workers whose own session this is: a command run from a worker's shell."""
        return [w for w in self.in_() if session and session in (w.session, w.resume)]
