from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.modules.environments.support.environment_rows import EnvironmentRows
from suites.coding.modules.workers.commands.cancel_worker_opening.cancel_worker_opening import CancelWorkerOpening
from suites.coding.modules.workers.commands.record_worktree_release.record_worktree_release import RecordWorktreeRelease
from suites.coding.modules.workers.commands.record_worktree_removal.record_worktree_removal import RecordWorktreeRemoval
from suites.coding.modules.workers.commands.release_worker.release_worker import ReleaseWorker
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.release_outcome import ReleaseOutcome
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class ReleaseWorkerHandler(Handler[ReleaseWorker, ReleaseOutcome]):
    """Releases a worker's tasks and removes its worktree, keeping a branch with commits. Git runs outside any
    transaction; a release whose git failed goes on from the abandoned worktree."""

    command = ReleaseWorker

    def __init__(self, worktrees: WorktreeQuery, git: WorktreeGit, environments: EnvironmentRows, bus: Bus) -> None:
        self.worktrees, self.git, self.environments, self.bus = worktrees, git, environments, bus

    def handle(self, command: ReleaseWorker, context: Context) -> ReleaseOutcome:
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None:
            raise Refusal(f"worker {command.worker_id} has no worktree out", "journal worker-worktree list shows the worktrees")
        folder = self.environments.find(worktree.environment_id).folder
        if worktree.state is WorktreeState.NEW:
            unmerged = self.git.remove(folder, worktree)
            self.bus.run_with_context(CancelWorkerOpening(worktree.id), context)
            return ReleaseOutcome(worktree, worktree.branch if unmerged else "")
        abandoned = self.abandoned(worktree, command, context)
        unmerged = self.git.remove(folder, abandoned)
        removed = self.bus.run_with_context(RecordWorktreeRemoval(abandoned.id), context)
        return ReleaseOutcome(removed, removed.branch if unmerged else "")

    def abandoned(self, worktree: Worktree, command: ReleaseWorker, context: Context) -> Worktree:
        if worktree.state is WorktreeState.ABANDONED:
            return worktree
        return self.bus.run_with_context(RecordWorktreeRelease(worktree.id, command.reason), context)
