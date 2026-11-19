from journal.features.seed import Seed
from journal.features.workers.jobs.worker_watch import WorkerWatch
from journal.features.workers.support.worker_actions import WorkerActions
from journal.features.workers.support.worker_resumes import WorkerResumes
from journal.features.workers.support.worker_runner import WorkerRunner
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.scope import Scope
from journal.repositories.workers import Workers
from journal.support.actor import Actor
from journal.support.rejection import Rejection


class WorkersSeed(Seed):
    """At boot, every worker still out whose run the restart stopped is sent on in its own session with its task, and every other one is handed to the worker watch, which files its report once its process has ended, so a restart never loses a worker."""

    def __init__(self, workers: Workers, watch: WorkerWatch, runner: WorkerRunner, resumes: WorkerResumes, actions: WorkerActions, scope: Scope) -> None:
        self.workers, self.watch, self.runner, self.resumes, self.actions, self.scope = workers, watch, runner, resumes, actions, scope

    def run(self) -> None:
        for worker in [*self.workers.global_matching(state=WorkerState.DISPATCHED), *self.workers.global_matching(state=WorkerState.READY)]:
            with self.scope.environment(worker.environment_id):
                self.taken_up(worker)

    def taken_up(self, worker: Worker) -> None:
        if self.runner.is_running(worker.pid) or not self.resumes.is_resumable(worker):
            self.watch.add(worker)
            return
        try:
            self.actions.restarted(worker.id, Actor.system())
        except Rejection:
            self.watch.add(worker)
