from journal.engine.job import Job
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.worker import Worker
from journal.support.actor import Actor
from journal.support.scope import Scope


class WorkerWatch(Job):
    """Every two seconds, each worker the journal found still out at boot is looked at: one whose process has ended has its report filed from its files, one past its time limit is stopped, so a restart never loses a worker."""

    interval_seconds = 2.0

    def __init__(self, runner: WorkerRunner, scope: Scope) -> None:
        self.runner, self.scope = runner, scope
        self.watched: list[Worker] = []

    def add(self, worker: Worker) -> None:
        self.watched.append(worker)

    def tick(self, time: float) -> None:
        for worker in list(self.watched):
            with self.scope.environment(worker.environment_id):
                if self.runner.is_finished(worker, Actor.system()):
                    self.watched.remove(worker)
