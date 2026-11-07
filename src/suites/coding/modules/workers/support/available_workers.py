from core.base.journal_home import JournalHome
from core.base.provider.providers import Providers
from core.modules.helpers.support.kept_helpers import FULL_SESSION_PERCENT
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_request import WorkerRequest
from suites.coding.modules.workers.support.worker_places import WorkerPlaces
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class AvailableWorkers:
    """Reads the kept workers that can take a new task: process ended, on the profile, program and model asked
    for, with no open worktree, no unmerged branch, and a session that resumes in the worker's folder and is not nearly
    full. The
    newest comes first. A worker with delivered work waits for its merge, so it is not offered."""

    def __init__(self, places: WorkerPlaces, worktrees: WorktreeQuery, git: WorktreeGit, providers: Providers, home: JournalHome) -> None:
        self.places, self.worktrees, self.git, self.providers, self.home = places, worktrees, git, providers, home

    def first(self, folder: str, request: WorkerRequest) -> Agent | None:
        matching = (worker for worker in self.places.kept_workers() if worker.ended_at is not None and request.matches(worker))
        return next((worker for worker in matching if self.is_available(folder, worker)), None)

    def is_available(self, folder: str, worker: Agent) -> bool:
        if self.worktrees.worker_worktree(worker.id) is not None:
            return False
        last = self.worktrees.newest_worktree(worker.id)
        if last is None or self.git.has_unmerged_branch(folder, last):
            return False
        provider = self.providers.provider(worker.program)
        if not provider.session_matches_folder(last.folder, worker.session):
            return False
        return (provider.context_percent(self.home, worker.session) or 0) < FULL_SESSION_PERCENT
