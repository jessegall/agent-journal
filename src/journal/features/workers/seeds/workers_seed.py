from journal.features.seed import Seed
from journal.features.workers.jobs.worker_watch import WorkerWatch
from journal.models.worker_state import WorkerState
from journal.repositories.workers import Workers


class WorkersSeed(Seed):
    """At boot, every worker still out, sent its job, clocked in on it or clocking out, is handed to the worker watch, which files its report once its process has ended or starts it again when the restart cut its run off, so a restart never loses a worker."""

    def __init__(self, workers: Workers, watch: WorkerWatch) -> None:
        self.workers, self.watch = workers, watch

    def run(self) -> None:
        for state in (WorkerState.DISPATCHED, WorkerState.READY, WorkerState.CLOCKING_OUT):
            for worker in self.workers.global_matching(state=state):
                self.watch.add(worker)
