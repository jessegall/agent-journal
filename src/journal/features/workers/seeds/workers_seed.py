from journal.features.seed import Seed
from journal.features.workers.jobs.worker_watch import WorkerWatch
from journal.models.worker_state import WorkerState
from journal.repositories.workers import Workers
from journal.sync.team_account import TeamAccount


class WorkersSeed(Seed):
    """At boot, every worker still out on this machine is handed to the worker watch, which files its report once its process has ended, so a restart never loses a worker."""

    def __init__(self, workers: Workers, watch: WorkerWatch, account: TeamAccount) -> None:
        self.workers, self.watch, self.account = workers, watch, account

    def run(self) -> None:
        for worker in self.workers.global_matching(state=WorkerState.DISPATCHED, device=self.account.device()):
            self.watch.add(worker)
