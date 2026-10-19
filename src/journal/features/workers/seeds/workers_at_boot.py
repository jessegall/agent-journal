import threading

from journal.features.seed import Seed
from journal.features.workers.worker_runner import WorkerRunner
from journal.support.actor import Actor
from journal.models.worker_state import WorkerState
from journal.support.scope import Scope
from journal.repositories.workers import Workers


class WorkersAtBoot(Seed):
    """At boot, every worker still out is looked at again: one whose process still runs is watched until it ends, one whose process ended while the journal was down has its report filed from its files, so a restart never loses a worker."""

    def __init__(self, workers: Workers, runner: WorkerRunner, scope: Scope) -> None:
        self.workers, self.runner, self.scope = workers, runner, scope

    def run(self) -> None:
        for worker in self.workers.across_environments(state=WorkerState.DISPATCHED):
            threading.Thread(target=self.watched, args=(worker,), name=f"worker-{worker.id}", daemon=True).start()

    def watched(self, worker) -> None:
        with self.scope.of(worker.environment_id):
            self.runner.watch(worker, Actor.system())
