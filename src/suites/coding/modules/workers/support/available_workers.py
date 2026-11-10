from pathlib import Path

from core.modules.settings.bindings.support.context_share import ContextShare
from engine.provider.providers import Providers
from core.modules.helpers.support.kept_helpers import FULL_SESSION_PERCENT
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_request import WorkerRequest
from suites.coding.modules.workers.support.worker_places import WorkerPlaces
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class AvailableWorkers:
    """Finds reusable workers with a resumable session and no unmerged work."""

    def __init__(self, places: WorkerPlaces, worktrees: WorktreeQuery, git: WorktreeGit, providers: Providers, share: ContextShare) -> None:
        self.places, self.worktrees, self.git, self.providers, self.share = places, worktrees, git, providers, share

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
        if not provider.session_matches_folder(Path(last.folder), worker.session):
            return False
        return (self.share.percent(worker.program, worker.session) or 0) < FULL_SESSION_PERCENT
