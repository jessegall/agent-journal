from journal.engine.job import Job
from journal.features.workers.support.worker_actions import WorkerActions
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.features.workers.workers_options import WorkersOptions
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope
from journal.repositories.setting_rows import SettingRows
from journal.repositories.workers import Workers
from journal.support.actor import Actor


class WorktreeCleanup(Job):
    """Every hour, in every environment of this machine, deletes the worktree of each retired worker and retires each worker at rest past the set hours with nothing unmerged, worktree and all; a worktree holding uncommitted files stays."""

    interval_seconds = 3600.0

    def __init__(self, workers: Workers, branch: WorkerBranch, actions: WorkerActions, environments: Environments, scope: Scope, settings: SettingRows) -> None:
        self.workers, self.branch, self.actions, self.environments, self.scope, self.settings = workers, branch, actions, environments, scope, settings

    def tick(self, time: float) -> None:
        for environment in self.environments.rows():
            with self.scope.environment(environment.row_id):
                for worker in self.workers.with_worktree():
                    self.cleaned(worker, time)

    def cleaned(self, worker: Worker, time: float) -> None:
        if not self.branch.folder(worker).is_dir():
            return
        if worker.adopted:
            self.branch.dropped(worker)
            return
        if self.is_retirement_due(worker, time):
            hours = self.settings.integer(WorkersOptions.IDLE_HOURS)
            if worker.state == WorkerState.RELEASED and self.branch.unmerged_count(worker):
                self.actions.discard(worker.id, f"released and at rest for over {hours} hours; its last commit stays as a tip", Actor.system())
            else:
                self.actions.complete(worker.id, f"at rest for over {hours} hours", Actor.system())

    def is_retirement_due(self, worker: Worker, time: float) -> bool:
        """A worker at rest past the set hours with nothing unmerged; a released one too, unmerged or not, since its work was
        given up and its last commit stays as a tip: on the hosted journal the worktrees of 25 released workers stayed for
        good, about 0.7 GiB each (19 Nov)."""
        hours = self.settings.integer(WorkersOptions.IDLE_HOURS)
        if not hours or not worker.is_retirable(time, 3600 * hours):
            return False
        return worker.state == WorkerState.RELEASED or not self.branch.unmerged_count(worker)
